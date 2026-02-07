import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Banner from '@/models/Banner';
import { authenticateRequest } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';

const SEED_PRODUCTS = [
  {
    title: 'Miniket Rice - 5kg',
    price: 350,
    shortDescription: 'Premium quality miniket rice',
    description:
      'High-quality miniket rice, perfect for daily meals. Clean, aromatic, and cooks fluffy. Ideal for biryani, pulao, and regular rice dishes. Sourced from the best paddy fields.',
    category: 'Rice & Grains',
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
    ],
  },
  {
    title: 'Teer Soybean Oil - 5 Liter',
    price: 850,
    shortDescription: 'Pure soybean cooking oil',
    description:
      'Teer fortified soybean oil enriched with Vitamin A and D. Cholesterol-free, light, and healthy for everyday cooking. Perfect for frying, baking, and all types of cooking.',
    category: 'Cooking Oil',
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500',
    ],
  },
  {
    title: 'Fresh Atta - 2kg',
    price: 120,
    shortDescription: 'Whole wheat flour for roti',
    description:
      'Fresh whole wheat atta (flour) perfect for making soft rotis, parathas, and other flatbreads. Stone-ground to retain nutrients. No additives or preservatives.',
    category: 'Rice & Grains',
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1628408135627-b9c2e68a2b3c?w=500',
    ],
  },
  {
    title: 'Radhuni Turmeric Powder - 200g',
    price: 85,
    shortDescription: 'Pure turmeric powder',
    description:
      'Premium quality turmeric powder (holud) from Radhuni. Pure, aromatic, and adds authentic color and flavor to your dishes. Essential for Bengali cooking.',
    category: 'Spices',
    stock: 80,
    images: [
      'https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=500',
    ],
  },
  {
    title: 'Red Lentils (Masoor Dal) - 1kg',
    price: 140,
    shortDescription: 'Premium red lentils',
    description:
      'High-quality red lentils (masoor dal), cleaned and sorted. Rich in protein and fiber. Cooks quickly and perfect for dal, soup, and various Bengali dishes.',
    category: 'Pulses & Lentils',
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500',
    ],
  },
  {
    title: 'Pran Mustard Oil - 1 Liter',
    price: 280,
    shortDescription: 'Pure mustard oil',
    description:
      'Pran pure mustard oil (sorisha tel) - the authentic taste of Bengali cooking. Perfect for fish curry, vegetables, and traditional recipes. Strong aroma and flavor.',
    category: 'Cooking Oil',
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500',
    ],
  },
  {
    title: 'Broiler Chicken - 1kg',
    price: 180,
    shortDescription: 'Fresh broiler chicken',
    description:
      'Fresh broiler chicken, cleaned and ready to cook. Tender meat perfect for curry, roast, grilled, or fried dishes. Hygienically processed and packaged.',
    category: 'Meat & Fish',
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500',
    ],
  },
  {
    title: 'Fresh Potatoes - 2kg',
    price: 60,
    shortDescription: 'Farm fresh potatoes',
    description:
      'Fresh potatoes (alu) sourced directly from farms. Perfect for curry, fries, mashed, or any potato dish. Clean, firm, and long-lasting.',
    category: 'Vegetables',
    stock: 100,
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500',
    ],
  },
  {
    title: 'Fresh Onions - 2kg',
    price: 80,
    shortDescription: 'Quality red onions',
    description:
      'Fresh red onions (peyaj) - essential for every kitchen. Strong flavor, perfect for cooking, salads, and garnishing. Firm and long-lasting.',
    category: 'Vegetables',
    stock: 90,
    images: [
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500',
    ],
  },
  {
    title: 'Pran Chinigura Rice - 1kg',
    price: 180,
    shortDescription: 'Aromatic chinigura rice',
    description:
      'Premium Pran Chinigura aromatic rice - the pride of Bangladesh. Short grain, highly aromatic, perfect for special occasions, polao, and khichuri. Limited harvest.',
    category: 'Rice & Grains',
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
    ],
  },
  {
    title: 'Fresh Milk - 1 Liter',
    price: 75,
    shortDescription: 'Pure cow milk',
    description:
      'Fresh pure cow milk, pasteurized and hygienically packed. Rich in calcium and protein. Perfect for tea, coffee, desserts, and drinking.',
    category: 'Dairy',
    stock: 40,
    images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500'],
  },
  {
    title: 'Farm Fresh Eggs - 12 pcs',
    price: 120,
    shortDescription: 'Fresh chicken eggs',
    description:
      'Farm fresh chicken eggs (dim), dozen pack. Rich in protein and nutrients. Perfect for breakfast, baking, and cooking. Clean and carefully packed.',
    category: 'Dairy',
    stock: 55,
    images: [
      'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500',
    ],
  },
  {
    title: 'ACI Pure Salt - 1kg',
    price: 35,
    shortDescription: 'Iodized table salt',
    description:
      'ACI Pure iodized salt (laban) - essential for every meal. Free-flowing, pure white, and enriched with iodine for better health. Vacuum evaporated.',
    category: 'Spices',
    stock: 100,
    images: [
      'https://images.unsplash.com/photo-1607672632458-9eb56696346b?w=500',
    ],
  },
  {
    title: 'Radhuni Chili Powder - 200g',
    price: 95,
    shortDescription: 'Pure red chili powder',
    description:
      'Radhuni pure red chili powder (morich gura) - adds perfect heat and color to your dishes. Made from premium quality dried chilies. Essential spice for Bengali cuisine.',
    category: 'Spices',
    stock: 70,
    images: [
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500',
    ],
  },
  {
    title: 'Fresh Tomatoes - 1kg',
    price: 50,
    shortDescription: 'Ripe red tomatoes',
    description:
      'Fresh ripe tomatoes (tomato) - juicy and flavorful. Perfect for curry, salad, sauce, and cooking. Rich in vitamins and antioxidants. Farm fresh quality.',
    category: 'Vegetables',
    stock: 75,
    images: ['https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500'],
  },
  {
    title: 'Pran Ghee - 500g',
    price: 550,
    shortDescription: 'Pure cow ghee',
    description:
      'Pran pure cow ghee (ghee) - traditional clarified butter. Rich aroma and authentic taste. Perfect for parathas, sweets, biryani, and special dishes. Premium quality.',
    category: 'Dairy',
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1628408135627-b9c2e68a2b3c?w=500',
    ],
  },
];

const SEED_BANNERS = [
  {
    title: 'Fresh Groceries Daily',
    imageUrl:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200',
    link: '/',
    priority: 3,
  },
  {
    title: 'Special Offers on Rice & Oil',
    imageUrl:
      'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200',
    link: '/',
    priority: 2,
  },
  {
    title: 'Farm Fresh Vegetables',
    imageUrl:
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1200',
    link: '/',
    priority: 1,
  },
];

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);

  if (!auth.authenticated || auth.user?.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 403 },
    );
  }

  try {
    await connectDB();

    const productsWithSlugs = SEED_PRODUCTS.map(p => ({
      ...p,
      slug: generateSlug(p.title),
      isActive: true,
    }));

    await Product.insertMany(productsWithSlugs, { ordered: false }).catch(
      () => {},
    );

    const bannersData = SEED_BANNERS.map(b => ({ ...b, isActive: true }));
    await Banner.insertMany(bannersData, { ordered: false }).catch(() => {});

    return NextResponse.json({
      success: true,
      data: { message: 'Demo data seeded successfully' },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
