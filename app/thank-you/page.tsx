// 'use client';

// import { useSearchParams } from 'next/navigation';
// import Link from 'next/link';
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';
// import ProtectedRoute from '@/components/ProtectedRoute';
// import { CheckCircle } from 'lucide-react';

// export default function ThankYouPage() {
//   const searchParams = useSearchParams();
//   const orderId = searchParams.get('orderId');

//   return (
//     <ProtectedRoute>
//       <div className="flex flex-col min-h-screen">
//         <Navbar />

//         <main className="flex-1 flex items-center justify-center">
//           <div className="text-center max-w-md px-4">
//             <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
//             <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
//             <p className="text-gray-600 mb-6">
//               Your payment slip has been submitted successfully. We will review
//               it and update your order status shortly.
//             </p>

//             {orderId && (
//               <p className="text-sm text-gray-500 mb-8">
//                 Order ID: <span className="font-mono">{orderId}</span>
//               </p>
//             )}

//             <div className="flex gap-4 justify-center">
//               <Link
//                 href="/orders"
//                 className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700"
//               >
//                 View My Orders
//               </Link>
//               <Link
//                 href="/"
//                 className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300"
//               >
//                 Continue Shopping
//               </Link>
//             </div>
//           </div>
//         </main>

//         <Footer />
//       </div>
//     </ProtectedRoute>
//   );
// }

import { Suspense } from 'react';
import ThankYouClient from './ThankYouClient';

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ThankYouClient />
    </Suspense>
  );
}
