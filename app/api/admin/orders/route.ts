import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import PaymentSlip from '@/models/PaymentSlip';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);

  if (!auth.authenticated || auth.user?.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 403 },
    );
  }

  try {
    await connectDB();

    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    const ordersWithSlips = await Promise.all(
      orders.map(async order => {
        if (order.paymentSlipId) {
          const slip = await PaymentSlip.findById(order.paymentSlipId).lean();
          return { ...order, paymentSlip: slip };
        }
        return order;
      }),
    );

    return NextResponse.json({
      success: true,
      data: ordersWithSlips,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
