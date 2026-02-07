import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Banner from '@/models/Banner';
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

    const banners = await Banner.find().sort({ priority: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: banners,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);

  if (!auth.authenticated || auth.user?.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();
    const { title, imageUrl, link, priority } = body;

    await connectDB();

    const banner = await Banner.create({
      title,
      imageUrl,
      link,
      priority: priority || 0,
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      data: banner,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
