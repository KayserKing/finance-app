import { NextRequest, NextResponse } from 'next/server';

export const corsMiddleware = async (req: NextRequest, res: NextResponse | null, next: () => void) => {

    if (!res) {
        return next();
    }
    res.headers.set('Access-Control-Allow-Credentials', 'true');
    res.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_BASE_URL || '*');
    res.headers.set(
        'Access-Control-Allow-Methods',
        'GET,OPTIONS,PATCH,DELETE,POST,PUT'
    );
    res.headers.set(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization'
    );

    if (req.method === 'OPTIONS') {
        return new NextResponse(null, { status: 200 });
    }

    return next();
};
