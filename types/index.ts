export interface User {
  _id: string;
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  images: string[];
  price: number;
  description: string;
  shortDescription: string;
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Banner {
  _id: string;
  title: string;
  imageUrl: string;
  link: string;
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  qty: number;
  imageUrl: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode?: string;
  country: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Paid'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  _id: string;
  userUid: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  paymentSlipId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentMethod = 'Bkash' | 'Nagad' | 'Bank' | 'Cash' | 'Other';

export interface PaymentSlip {
  _id: string;
  orderId: string;
  userUid: string;
  method: PaymentMethod;
  trxId: string;
  screenshotUrl?: string;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  qty: number;
  imageUrl: string;
  stock: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}
