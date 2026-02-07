import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { authenticateRequest } from '@/lib/auth';
import { calculateShipping } from '@/lib/utils';

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);

  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const { items, shippingAddress } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 },
      );
    }

    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.qty,
      0,
    );
    const shipping = calculateShipping(subtotal);
    const total = subtotal + shipping;

    await connectDB();

    const order = await Order.create({
      userUid: auth.user!.uid,
      userEmail: auth.user!.email,
      items,
      subtotal,
      shipping,
      total,
      shippingAddress,
      status: 'Pending',
    });

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);

  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: 401 },
    );
  }

  try {
    await connectDB();

    const orders = await Order.find({ userUid: auth.user!.uid })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
