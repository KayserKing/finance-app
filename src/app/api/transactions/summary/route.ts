import { NextResponse } from 'next/server';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfDay, endOfDay } from 'date-fns';

import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import Transaction from '@/models/Transaction';
import Loan from '@/models/Loan';
import { calculateTransactionSummary } from '@/utils';

export async function GET() {
  try {
    // Connect to the database
    await dbConnect(process.env.MONGODB_DB_2!);

    // Fetch all active customers
    const loansDetails = Loan.find();
    if (!loansDetails) {}
    const activeCustomers = await Customer.find({ active: true }).populate('loanIds');
    if (!activeCustomers || activeCustomers.length === 0) {
      return NextResponse.json({ message: 'No active customers found' }, { status: 404 });
    }

    const periods = ['TODAY', 'THIS WEEK', 'THIS MONTH', 'THIS YEAR'];
    const aggregatedSummary = {
      TODAY: { receivedAmount: 0, yetToReceiveAmount: 0 },
      'THIS WEEK': { receivedAmount: 0, yetToReceiveAmount: 0 },
      'THIS MONTH': { receivedAmount: 0, yetToReceiveAmount: 0 },
      'THIS YEAR': { receivedAmount: 0, yetToReceiveAmount: 0 },
    };

    // Loop through each active customer
    for (const customer of activeCustomers) {
      const loans = customer.loanIds || [];
      const transactions = await Transaction.find({ customerId: customer._id });

      // Calculate the summary for different periods for each customer
      for (const period of periods) {
        let startDate, endDate;

        switch (period) {
          case 'TODAY':
            startDate = startOfDay(new Date());
            endDate = endOfDay(new Date());
            break;
          case 'THIS WEEK':
            startDate = startOfWeek(new Date());
            endDate = endOfWeek(new Date());
            break;
          case 'THIS MONTH':
            startDate = startOfMonth(new Date());
            endDate = endOfMonth(new Date());
            break;
          case 'THIS YEAR':
            startDate = startOfYear(new Date());
            endDate = endOfYear(new Date());
            break;
          default:
            return NextResponse.json({ message: 'Invalid period' }, { status: 400 });
        }

        // Convert to UTC manually
        startDate = new Date(startDate.toISOString()); // Ensures it’s in UTC
        endDate = new Date(endDate.toISOString()); // Ensures it’s in UTC

        const { receivedAmount, yetToReceiveAmount } = calculateTransactionSummary(
          transactions,
          loans,
          startDate,
          endDate
        );

        // Aggregate the received and yetToReceive amounts for all customers
        aggregatedSummary[period].receivedAmount += receivedAmount;
        aggregatedSummary[period].yetToReceiveAmount += yetToReceiveAmount;
      }
    }

    // Return the aggregated summary for all customers
    return NextResponse.json(
      { summary: aggregatedSummary },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error calculating transaction summary:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
