import mongoose, { Schema, Model } from 'mongoose';
import { PaymentSlip } from '@/types';

const PaymentSlipSchema = new Schema<PaymentSlip>(
  {
    orderId: { type: String, required: true },
    userUid: { type: String, required: true },
    method: {
      type: String,
      enum: ['Bkash', 'Nagad', 'Bank', 'Cash', 'Other'],
      required: true,
    },
    trxId: { type: String, required: true },
    screenshotUrl: { type: String },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const PaymentSlipModel: Model<PaymentSlip> =
  mongoose.models.PaymentSlip ||
  mongoose.model<PaymentSlip>('PaymentSlip', PaymentSlipSchema);

export default PaymentSlipModel;
