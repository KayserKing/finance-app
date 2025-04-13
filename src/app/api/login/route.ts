import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { corsMiddleware } from '@/lib/cors';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    await new Promise<void>((resolve, reject) => {
      corsMiddleware(req, (response: NextResponse) => {
        if (response.status === 200) {
          resolve();
        } else {
          reject('CORS Error');
        }
      });
    });

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    await dbConnect(process.env.MONGODB_DB_1);

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const payload = {
      id: user._id.toString(),
      username: user.username,
    };

    const token = jwt.sign(payload, JWT_SECRET);

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: payload,
    });
  } catch (err) {
    console.error('Login Error:', err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
