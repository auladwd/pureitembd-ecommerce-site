import { NextRequest } from 'next/server';
import { verifyIdToken } from './firebaseAdmin';
import connectDB from './db';
import User from '@/models/User';

export async function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authenticated: false, error: 'No token provided' };
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await verifyIdToken(token);
    await connectDB();

    const user = await User.findOne({ uid: decodedToken.uid });

    if (!user) {
      return { authenticated: false, error: 'User not found' };
    }

    return {
      authenticated: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (error) {
    return { authenticated: false, error: 'Invalid token' };
  }
}

export function isAdmin(email: string): boolean {
  const adminEmails =
    process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
  return adminEmails.includes(email);
}
