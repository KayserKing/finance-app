import { NextRequest, NextResponse } from 'next/server';

export const corsMiddleware = (req: NextRequest, next: (response: NextResponse) => void) => {
  const res = new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_BASE_URL || '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization',
    },
  });

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200 });
  }

  // Call next with the response
  next(res);
};
