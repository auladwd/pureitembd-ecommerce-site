import mongoose, { Schema, Model } from 'mongoose';
import { Product } from '@/types';

const ProductSchema = new Schema<Product>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    images: [{ type: String }],
    price: { type: Number, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const ProductModel: Model<Product> =
  mongoose.models.Product || mongoose.model<Product>('Product', ProductSchema);

export default ProductModel;
