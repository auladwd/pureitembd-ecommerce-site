import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    slug: string;
    images: string[];
    price: number;
    shortDescription: string;
    stock: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 bg-gray-200">
          <Image
            src={product.images[0] || '/placeholder.png'}
            alt={product.title}
            fill
            className="object-cover"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.shortDescription}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-primary-600 font-bold text-xl">
              {formatCurrency(product.price)}
            </span>
            <span className="text-sm text-gray-500">
              Stock: {product.stock}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
