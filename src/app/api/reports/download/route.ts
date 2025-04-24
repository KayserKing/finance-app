import { NextResponse } from 'next/server';
import Transactions from '@/models/Transaction';
import Customer from '@/models/Customer';
import { parse } from 'json2csv';
import { writeFileSync } from 'fs';
import { join } from 'path';
import dbConnect from '@/lib/mongodb';

export async function POST(req: Request) {
  await dbConnect(process.env.MONGODB_DB_2!);
  const body = await req.json();
  const { customerId, range } = body;

  try {
    const query: {
      date?: { $gte?: Date; $lte?: Date };
      customerId?: string;
    } = {};
    const today = new Date();

    // Handle range logic
    if (range && range !== 'FULL') {
      const dateFilter: { $gte?: Date; $lte?: Date } = { $lte: today };

      if (range === 'THIS MONTH') {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        dateFilter.$gte = startOfMonth;
      } else if (range === 'LAST 3 MONTHS') {
        const last3Months = new Date(today);
        last3Months.setMonth(today.getMonth() - 3);
        dateFilter.$gte = last3Months;
      } else if (range === 'LAST MONTH') { // currently not used if need can use in future
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0); // last day of previous month

        dateFilter.$gte = lastMonthStart;
        dateFilter.$lte = lastMonthEnd;

      }

      query.date = dateFilter;
    }

    // Handle customer filtering
    if (customerId) {
      const [name, mobileNumber] = customerId.split(' - ');
      const customer = await Customer.findOne({ name, mobileNumber });

      if (!customer) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      }

      query.customerId = customer._id;
    }

    // Get filtered payments
    const payments = await Transactions.find(query).populate('customerId');

    // Prepare CSV
    const csvFields = ['SL No', 'Date', 'Customer Name', 'Amount', 'Payment Tier'];
    const csvData = payments.map((p, index) => ({
      'SL No': index + 1,
      'Date': new Date(p.date).toLocaleDateString('en-IN'),
      'Customer Name': p.customerId?.name || 'N/A',
      'Amount': p.amount,
      'Payment Tier': p.transactionType,
      'Payment Type': p?.paymentType
    }));

    const csv = parse(csvData, { fields: csvFields });
    const filePath = join(process.cwd(), 'public', 'reports.csv');
    writeFileSync(filePath, csv);

    return NextResponse.json({ success: true, filePath: '/reports.csv' });

  } catch (error) {
    console.error('CSV generation error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
