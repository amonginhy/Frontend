export type Id = string;

export interface Bakery {
  id: Id;
  name: string;
  slug: string;
  cover: string;
  logo?: string;
  rating: number;
  reviews: number;
  deliveryMinutes: number;
  city: string;
  tags: string[];
  featured?: boolean;
}

export interface Product {
  id: Id;
  bakeryId: Id;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  rating: number;
  reviews: number;
  category: 'cake' | 'cupcake' | 'pastry' | 'cookie' | 'bread';
  tags: string[];
  preparationHours: number;
  customizable: boolean;
  allergens?: string[];
}

export interface Topping {
  id: Id;
  name: string;
  price: number;
  emoji?: string;
}

export interface Filling {
  id: Id;
  name: string;
  price: number;
}

export interface SizeOption {
  id: Id;
  label: string;
  serves: string;
  priceMultiplier: number;
}

export interface FlavorOption {
  id: Id;
  name: string;
  description?: string;
  priceDelta?: number;
}

export interface DietaryOption {
  id: Id;
  label: string;
  conflicts?: string[]; // ingredient ids/keys
}

export interface CakeCustomization {
  sizeId: Id;
  flavorId: Id;
  fillingIds: Id[];
  toppingIds: Id[];
  message?: string;
  dietary: Id[];
}

export interface CartItem {
  id: Id;
  productId: Id;
  bakeryId: Id;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  customization?: CakeCustomization;
  notes?: string;
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'baking'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export interface OrderTimelineEntry {
  status: OrderStatus;
  at: string;
  note?: string;
}

export interface Order {
  id: Id;
  reference: string;
  customerName: string;
  customerAvatar?: string;
  bakeryId: Id;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  placedAt: string;
  estimatedReadyAt: string;
  address: string;
  paymentMethod: 'card' | 'mobile_money' | 'cash';
  notes?: string;
  timeline: OrderTimelineEntry[];
}

export interface User {
  id: Id;
  name: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'vendor' | 'admin';
}

export interface Review {
  id: Id;
  author: string;
  avatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AnalyticsPoint {
  label: string;
  value: number;
  secondary?: number;
}

export interface KPI {
  id: string;
  label: string;
  value: number;
  delta: number;
  prefix?: string;
  suffix?: string;
  format?: 'currency' | 'number' | 'percent';
}
