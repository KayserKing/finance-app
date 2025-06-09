import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import Loan from '@/models/Loan';
import Transaction from '@/models/Transaction';
import Payment from '@/models/Payment';

export async function GET(
  req: NextRequest
) {
  try {
    await dbConnect(process.env.MONGODB_DB_2!);

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const customerId = pathSegments[pathSegments.length - 1];

    const loans = Loan.find();
    if (!loans) { }

    const customer = await Customer.findById(customerId).populate('loanIds');
    if (!customer) {
      return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
    }

    const loanIds = customer.loanIds?.map((loan: { _id: string }) => loan._id) || [];

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

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/");
    const customerId = pathSegments[pathSegments.length - 1];

    // Check if customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer not found" },
        { status: 404 }
      );
    }

    // Delete related records
    await Promise.all([
      Loan.deleteMany({ customerId }),
      Transaction.deleteMany({ customerId }),
      Payment.deleteMany({ customerId }),
    ]);

    // Delete customer
    await Customer.findByIdAndDelete(customerId);

    return NextResponse.json({
      success: true,
      message: "Customer and all related records deleted",
    });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
