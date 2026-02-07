import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import PaymentSlip from '@/models/PaymentSlip';
import { authenticateRequest } from '@/lib/auth';

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
    const { orderId, method, trxId, screenshotUrl } = body;

    if (!orderId || !method || !trxId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      );
    }

    if (trxId.length < 5) {
      return NextResponse.json(
        {
          success: false,
          error: 'Transaction ID must be at least 5 characters',
        },
        { status: 400 },
      );
    }

    await connectDB();

    const order = await Order.findOne({
      _id: orderId,
      userUid: auth.user!.uid,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 },
      );
    }

    if (order.status === 'Cancelled') {
      return NextResponse.json(
        { success: false, error: 'Cannot submit slip for cancelled order' },
        { status: 400 },
      );
    }

    if (order.paymentSlipId) {
      return NextResponse.json(
        { success: false, error: 'Payment slip already submitted' },
        { status: 400 },
      );
    }

    const slip = await PaymentSlip.create({
      orderId,
      userUid: auth.user!.uid,
      method,
      trxId,
      screenshotUrl,
    });

    order.paymentSlipId = slip._id as any;
    await order.save();

    return NextResponse.json({
      success: true,
      data: slip,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
