import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { authenticateRequest } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';

export async function PUT(
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
    const {
      title,
      price,
      shortDescription,
      description,
      category,
      stock,
      images,
      isActive,
    } = body;

    await connectDB();

    const slug = generateSlug(title);

    const product = await Product.findByIdAndUpdate(
      params.id,
      {
        title,
        slug,
        price,
        shortDescription,
        description,
        category,
        stock,
        images,
        isActive,
      },
      { new: true },
    );

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 },
      );
    }

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

export async function DELETE(
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
    await connectDB();

    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Product deleted' },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
