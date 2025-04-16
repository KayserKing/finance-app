import Loan from '@/models/Loan';
import Customer from '@/models/Customer';
import Transaction from '@/models/Transaction';
import dbConnect from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        await dbConnect(process.env.MONGODB_DB_2);
        const body = await req.json();
        const { customerName, loanAmount, loanStartDate, transactionType, paymentType } = body;

        const [namePart, mobilePart] = customerName.split(' - ').map((str: string) => str.trim());
        const customer = await Customer.findOne({ name: namePart, mobileNumber: mobilePart })
        if (!customer) {
            return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
        }

        const loanStart = new Date(loanStartDate);
        const loanEnd = new Date(loanStart);
        loanEnd.setDate(loanEnd.getDate() + 100);

        const loan = await Loan.create({
            loanAmount,
            loanStartDate: loanStart,
            loanEndDate: loanEnd,
            dailyAmountToBePaid: loanAmount / 100,
            customerId: customer._id,
        });

        if (!Array.isArray(customer.loanIds)) {
            customer.loanIds = [];
          }
          customer.loanIds.push(loan._id);
          await customer.save();

        await Transaction.create({
            amount: loanAmount,
            customerId: customer._id,
            loanId: loan._id,
            transactionType,
            paymentType,
            date: new Date()
        });

        return NextResponse.json({ message: 'Loan created', data: loan }, { status: 201 });
    } catch (error) {

        console.error('Loan Creation Error:', error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 404 });
    }
}
