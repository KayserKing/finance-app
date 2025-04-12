import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    username: string;
}

function isJwtPayload(payload: string | object): payload is JwtPayload {
    return typeof payload === 'object' && payload !== null && 'username' in payload;
  }

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    let decoded:  JwtPayload;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
        if (!isJwtPayload(decodedToken)) {
          return NextResponse.json({ message: 'Invalid token payload' }, { status: 401 });
        }
        decoded = decodedToken;
    } catch {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    const { username } = decoded;

    const { currentPassword, newPassword } = await req.json();

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Incorrect current password' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (err) {
    console.error('Password change error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
