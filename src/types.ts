export type Size = 'S/M' | 'L/XL' | 'ONE SIZE';

export interface Product {
  id: string;
  name: string;
  code: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  category: 'balaclava' | 'hood' | 'goggles' | 'gear';
  rating: number;
  reviewCount: number;
  baseColor: string;
  thermoColor: string;
  coldHex: string;
  warmHex: string;
  tempThreshold: string;
  description: string;
  features: string[];
  specs: {
    material: string;
    temperatureRange: string;
    breathability: string;
    weatherproof: string;
    weight: string;
  };
  primaryImage: string;
  warmImage?: string;
  modelImage?: string;
  sizes: Size[];
  badge?: string;
  inStock: boolean;
  texturePattern: 'faceted' | 'camo' | 'solid' | 'knit';
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  baseColor: string;
  thermoColor: string;
  coldHex: string;
  warmHex: string;
  size: Size;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type ShippingSpeed = 'standard' | 'express';

export interface ShippingMethod {
  id: ShippingSpeed;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

export interface Order {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  address: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: 'card' | 'apple_pay' | 'google_pay' | 'klarna';
  status: 'Confirmed' | 'Thermal QC' | 'Alpine Dispatch' | 'In Transit' | 'Delivered';
}
