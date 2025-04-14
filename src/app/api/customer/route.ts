import '@/models';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; 
import Customer from '@/models/Customer'; 
import Loan from '@/models/Loan';

export async function GET() {
  try {
    await dbConnect(process.env.MONGODB_DB_2)

    const loans = Loan.find();
    console.log(loans);
    const customers = await Customer.find().sort({ createdAt: -1 })?.populate('loanIds');
    return NextResponse.json({ data: customers }, { status: 200 });
  } catch (error) {
    console.error('GET /customer error:', error);
    return NextResponse.json({ message: 'Failed to fetch customers' }, { status: 500 });
  }
}
