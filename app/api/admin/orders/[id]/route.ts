import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { authenticateRequest } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await authenticateRequest(request);

  if (!auth.authenticated || auth.user?.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();
    const { status } = body;

    if (
      !['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'].includes(status)
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 },
      );
    }

    await connectDB();

    const order = await Order.findByIdAndUpdate(
      params.id,
      { status },
      { new: true },
    );

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 },
      );
    }

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
