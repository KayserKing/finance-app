import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';

export async function POST(req: Request) {
  try {
    await dbConnect(process.env.MONGODB_DB_2!);

    const body = await req.json();
    const { name, mobileNumber, altMobileNumber } = body;

    if (!name || !mobileNumber) {
      return NextResponse.json({ message: 'Name and Mobile Number are required' }, { status: 400 });
    }

    const existingCustomer = await Customer.findOne({ mobileNumber });
    if (existingCustomer) {
      return NextResponse.json({ message: 'Customer already exists' }, { status: 409 });
    }

    const newCustomer = await Customer.create({
      name,
      mobileNumber,
      altMobileNumber,
    });

    return NextResponse.json({ message: 'Customer created', data: newCustomer }, { status: 201 });
  } catch (error) {
    console.error('Create Customer Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
