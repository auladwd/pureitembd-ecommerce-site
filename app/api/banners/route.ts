import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Banner from '@/models/Banner';

export async function GET() {
  try {
    await connectDB();

    const banners = await Banner.find({ isActive: true })
      .sort({ priority: -1 })
      .lean();

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
