import '@/models';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; 
import Customer from '@/models/Customer'; 
import { FilterQuery } from 'mongoose';
import Loan from '@/models/Loan';

export async function GET(req: Request) {
  try {
    await dbConnect(process.env.MONGODB_DB_2!);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const filter = searchParams.get('filter'); // all, paid, unpaid

    const loans = Loan.find();
    if(!loans){}

    const query: FilterQuery<typeof Customer> = {};

    if (search) {
      const regex = new RegExp(search, 'i'); 
      query.$or = [
        { name: { $regex: regex } },
        { mobileNumber: { $regex: regex } },
        { mobileAltNumber: { $regex: regex } }
      ];
    }

    if (filter === 'unpaid') {
      query.active = true;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

    //   if (filter === 'today') {
    //     query.lastPaidDate = {
    //       $gte: today,
    //       $lt: tomorrow
    //     };
    //   }

      if (filter === 'unpaid') {
        query.$or = [
          { lastPaidDate: { $lt: today } },
          { lastPaidDate: { $exists: false } }
        ];
      }
    }

    if (filter === 'paid') {
      query.active = true;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      query.lastPaidDate = {
        $gte: today,
        $lt: tomorrow
      };

    }

    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .populate('loanIds');

    return NextResponse.json({ data: customers }, { status: 200 });

  } catch (error) {
    console.error('GET /customer error:', error);
    return NextResponse.json({ message: 'Failed to fetch customers' }, { status: 500 });
  }
}
