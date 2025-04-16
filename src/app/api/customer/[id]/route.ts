import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
// import Loan from '@/models/Loan';
import Transaction from '@/models/Transaction';
import Payment from '@/models/Payment';

export async function GET(
    _req: Request,
    _res: Response,
    context: { params: { id: string } }
  ) {
  try {
    await dbConnect(process.env.MONGODB_DB_2);

    const customerId = context.params.id;

    const customer = await Customer.findById(customerId).populate('loanIds');
    if (!customer) {
      return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
    }

    const loanIds = customer.loanIds?.map((loan: {_id:string}) => loan._id) || [];

    const transactions = await Transaction.find({
      $or: [
        { customerId },
        { loanId: { $in: loanIds } }
      ]
    }).sort({ date: -1 });

    const payments = await Payment.find({
      $or: [
        { customerId },
        { loanId: { $in: loanIds } }
      ]
    }).sort({ date: -1 });

    return NextResponse.json({
      data: {
        customer,
        loans: customer.loanIds,
        transactions,
        payments,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('GET /api/customer/[id] error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
