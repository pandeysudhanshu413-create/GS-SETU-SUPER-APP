export interface FoodProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  isAvailable: boolean;
  isVeg: boolean;
  preparationTimeMinutes: number;
  sellerName: string;
  sellerLocation: string;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export type OrderStatus = 'New' | 'Accepted' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  location: string;
  deliveryInstructions?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  statusReason?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }>;
}

export interface CartItem {
  product: FoodProduct;
  quantity: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  hindiName: string;
  tagline: string;
  description: string;
  iconName: string;
  badge: 'Enabled' | 'Coming Soon';
  accentColor: string;
  image: string;
  features: string[];
  sampleItems?: Array<{
    name: string;
    detail: string;
    priceHint?: string;
  }>;
}

export interface PartnerApplication {
  id: string;
  type: 'seller' | 'delivery' | 'worker';
  fullName: string;
  phone: string;
  villageTown: string;
  serviceCategory: string;
  experienceDescription: string;
  status: 'Pending' | 'Approved' | 'Contacted';
  createdAt: string;
}

export interface EmailLog {
  id: string;
  orderId: string;
  recipient: string;
  subject: string;
  status: 'Sent' | 'Logged' | 'Failed';
  timestamp: string;
  details: string;
}
