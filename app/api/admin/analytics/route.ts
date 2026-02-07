import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
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

    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.countDocuments({
      status: { $in: ['Paid', 'Shipped', 'Delivered'] },
    });

    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ['Paid', 'Shipped', 'Delivered'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    const pendingSlips = await Order.countDocuments({
      status: 'Pending',
      paymentSlipId: { $exists: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        paidOrders,
        revenue,
        pendingSlips,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
