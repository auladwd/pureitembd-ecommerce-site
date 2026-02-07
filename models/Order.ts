import mongoose, { Schema, Model } from 'mongoose';
import { Order } from '@/types';

const OrderSchema = new Schema<Order>(
  {
    userUid: { type: String, required: true },
    userEmail: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
        imageUrl: { type: String, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      postalCode: { type: String },
      country: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    paymentSlipId: { type: Schema.Types.ObjectId, ref: 'PaymentSlip' },
  },
  { timestamps: true },
);

const OrderModel: Model<Order> =
  mongoose.models.Order || mongoose.model<Order>('Order', OrderSchema);

export default OrderModel;
