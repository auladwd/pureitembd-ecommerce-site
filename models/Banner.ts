import mongoose, { Schema, Model } from 'mongoose';
import { Banner } from '@/types';

const BannerSchema = new Schema<Banner>(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    link: { type: String, required: true },
    priority: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const BannerModel: Model<Banner> =
  mongoose.models.Banner || mongoose.model<Banner>('Banner', BannerSchema);

export default BannerModel;
