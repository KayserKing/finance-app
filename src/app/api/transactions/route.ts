import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Customer from '@/models/Customer';
import { FilterQuery } from 'mongoose';

export async function GET(req: Request) {
    try {
        await dbConnect(process.env.MONGODB_DB_2);

        const { searchParams } = new URL(req.url);

        const customerName = searchParams.get('customerName');
        const transactionType = searchParams.get('transactionType'); // SEND or RECEIVE

        const filter: FilterQuery<typeof Transaction> = {};
        if (transactionType && ['SEND', 'RECEIVE'].includes(transactionType.toUpperCase())) {
            filter.transactionType = transactionType.toUpperCase();
        }

        const period = searchParams.get('period'); // "day", "week", "month", or "year"

        if (period) {
            let startDate;
            const now = new Date();
            const localNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            switch (period.toLowerCase()) {
                case 'day':
                    startDate = localNow;
                    break;
                case 'week':
                    startDate = new Date(localNow);
                    startDate.setDate(localNow.getDate() - localNow.getDay());
                    break;
                case 'month':
                    startDate = new Date(localNow.getFullYear(), localNow.getMonth(), 1);
                    break;
                case 'year':
                    startDate = new Date(localNow.getFullYear(), 0, 1);
                    break;
                default:
                    break;
            }

            if (startDate) {
                filter.date = { $gte: startDate };
            }
        }

        if (customerName) {
            const [name, mobileNumber] = customerName.split(' - ').map((s: string) => s.trim());
            const customer = await Customer.findOne({ name, mobileNumber });

            if (!customer) {
                return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
            }

            filter.customerId = customer._id;
        }

        const transactions = await Transaction.find(filter)
            .sort({ date: -1 })
            .populate('customerId', 'name mobileNumber')
            .populate('loanId', 'loanAmount');

        return NextResponse.json({ data: transactions }, { status: 200 });
    } catch (error) {
        console.error('GET /transactions error:', error);
        return NextResponse.json({ message: 'Failed to fetch transactions' }, { status: 500 });
    }
}
