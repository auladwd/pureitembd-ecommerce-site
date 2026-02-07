import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyIdToken } from '@/lib/firebaseAdmin';
import { isAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 },
      );
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await verifyIdToken(token);

    const body = await request.json();
    const { uid, email, name, photoURL } = body;

    await connectDB();

    const role = isAdmin(email) ? 'admin' : 'user';

    const user = await User.findOneAndUpdate(
      { uid },
      { uid, email, name, photoURL, role },
      { upsert: true, new: true },
    );

    return NextResponse.json({
      success: true,
      data: { user },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
