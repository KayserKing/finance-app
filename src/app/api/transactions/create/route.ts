import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import Loan from '@/models/Loan';
import Transaction from '@/models/Transaction';
import Payment from '@/models/Payment';
import { NextResponse } from 'next/server';
import { formatDate } from '@/utils';

export async function POST(req: Request) {
    try {
        await dbConnect(process.env.MONGODB_DB_2);
        const body = await req.json();
        const { customerName, loanAmount: amount, loanStartDate: date, transactionType, paymentType } = body;

        const [name, mobileNumber] = customerName.split(' - ').map((s: string) => s.trim());
        const customer = await Customer.findOne({ name, mobileNumber });

        if (!customer) {
            return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
        }

            const loan = await Loan.findOne({ customerId: customer._id, active: true }).sort({ createdAt: -1 });

            if (!loan) {
                return NextResponse.json({ message: 'Active loan not found for customer' }, { status: 404 });
            }

            const existingTransaction = await Transaction.findOne({
                customerId: customer._id,
                date: new Date(date).toISOString().split('T')[0],
            });

            if (existingTransaction) {
                return NextResponse.json({ message: `Already paid on ${formatDate(new Date(date), 'dd-MMM-yyyy')}` }, { status: 400 });
            }

            const isExactAmount = amount === loan.dailyAmountToBePaid;

            if (isExactAmount) {
                await Transaction.create({
                    amount,
                    customerId: customer._id,
                    loanId: loan._id,
                    transactionType,
                    paymentType,
                    date,
                });
            } else {
                const paymentTier = amount > loan.dailyAmountToBePaid ? 'HIGH' : 'LOW';
                await Transaction.create({
                    amount,
                    customerId: customer._id,
                    loanId: loan._id,
                    transactionType,
                    paymentType,
                    date,
                });
                await Payment.create({
                    amount,
                    customerId: customer._id,
                    loanId: loan._id,
                    paymentTier,
                    paymentType,
                    date,
                });
            }

            customer.amountPaid = (customer.amountPaid || 0) + amount;
            customer.lastPaidDate = new Date(date);
            await customer.save();

        return NextResponse.json({ message: 'Entry successfully created' }, { status: 201 });
    } catch (error) {
        console.error('Transaction Entry Error:', error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}
