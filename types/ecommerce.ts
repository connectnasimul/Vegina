export type ProductCategory =
  | 'all'
  | 'vegetables'
  | 'fruits'
  | 'dairy-eggs'
  | 'honey-ghee'
  | 'spices'
  | 'oil-grains';

export interface Product {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  category: ProductCategory;
  categoryName: string;
  categoryNameBn: string;
  price: number;
  originalPrice: number;
  unit: string;
  unitBn: string;
  image: string;
  badge?: 'Organic' | 'Farm Fresh' | 'Best Seller' | 'Deal' | 'New';
  badgeBn?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  soldCount: number;
  origin: string;
  originBn: string;
  description: string;
  descriptionBn: string;
  nutrition: {
    calories: string;
    shelfLife: string;
    shelfLifeBn: string;
    organicCertified: boolean;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  nameBn: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
}

export type OrderStatus =
  | 'Processing'
  | 'Farm Dispatched'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  division: string;
  city: string;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'COD';
  paymentStatus: 'Paid' | 'Pending';
  transactionId?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  adminNotes?: string;
  riderName?: string;
  riderPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  address?: string;
  division?: string;
  role?: 'customer' | 'admin';
  createdAt?: string;
}
