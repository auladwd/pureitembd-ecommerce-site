import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { authenticateRequest } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';

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

    const products = await Product.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: products,
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
    const {
      title,
      price,
      shortDescription,
      description,
      category,
      stock,
      images,
    } = body;

    await connectDB();

    const slug = generateSlug(title);

    const product = await Product.create({
      title,
      slug,
      price,
      shortDescription,
      description,
      category,
      stock,
      images,
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
