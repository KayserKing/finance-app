import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Customer from '@/models/Customer';
import { FilterQuery } from 'mongoose';

export async function GET(req: Request) {
  try {
    await dbConnect(process.env.MONGODB_DB_2!);

    const { searchParams } = new URL(req.url);

    const customerName = searchParams.get('search');
    const period = searchParams.get('period'); // "day", "week", "month", "year"
    const filters = searchParams.getAll('filters');

    const start = searchParams.get('start');
    const end = searchParams.get('end');

    const filter: FilterQuery<typeof Transaction> = {};

    // Apply type filters
    if (filters.length > 0) {
      const upperFilters = filters.map(f => f.toUpperCase());

      const validTransactionTypes = ['SEND', 'RECEIVE'];
      const validPaymentTypes = ['INHAND', 'ACCOUNT'];

      const transactionTypes = upperFilters.filter(f => validTransactionTypes.includes(f));
      const paymentTypes = upperFilters.filter(f => validPaymentTypes.includes(f));

      if (transactionTypes.length > 0) {
        filter.transactionType = { $in: transactionTypes };
      }

      if (paymentTypes.length > 0) {
        filter.paymentType = { $in: paymentTypes };
      }
    }

    // Date range override
    if (start && end) {
      const fromDate = new Date(start);
      const toDate = new Date(end);
      toDate.setHours(23, 59, 59, 999); // Include full end day
      filter.date = { $gte: fromDate, $lte: toDate };
    } else if (start) {
      const specificDate = new Date(start);
      const nextDay = new Date(specificDate);
      nextDay.setDate(specificDate.getDate() + 1);
      filter.date = { $gte: specificDate, $lt: nextDay };
    }
    // If no custom range, apply "period" filter
    else if (period) {
      let startDate: Date | null = null;
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
      }

      if (startDate) {
        filter.date = { $gte: startDate };
      }
    }

    // Filter by customer name
    if (customerName) {
      const customers = await Customer.find({
        name: { $regex: customerName, $options: 'i' }
      });

      if (!customers || customers.length === 0) {
        return NextResponse.json({ message: 'No matching customers found' }, { status: 404 });
      }

      const customerIds = customers.map(c => c._id);
      filter.customerId = { $in: customerIds };
    }

    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .populate('customerId', 'name')
      .populate('loanId', 'loanAmount');

    return NextResponse.json({ data: transactions }, { status: 200 });
  } catch (error) {
    console.error('GET /transactions error:', error);
    return NextResponse.json({ message: 'Failed to fetch transactions' }, { status: 500 });
  }
}
