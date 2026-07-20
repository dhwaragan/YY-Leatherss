/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Profile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  role: 'admin' | 'customer';
  address?: string;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp?: number;
  weight_kg?: number;
  // per-size pricing, keys are size labels like '5','6',..'12'
  sizePrices?: Record<string, number>;
  // per-size MRP overrides for each size
  sizeMRPs?: Record<string, number>;
  // per-size weight overrides for shipping and packaging
  sizeWeights?: Record<string, number>;
  // per-size stock quantity (admin-only, hidden from users)
  sizeQuantities?: Record<string, number>;
  category: string;
  images: string[];
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_published: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  phone?: string;
  address: string;
  delivery_region?: string;
  delivery_charge?: number;
  estimated_weight_kg?: number;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled';
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  buyback_requested?: boolean;
  buyback_details?: {
    shoe_details: string;
    bill_no: string;
    bought_date: string;
    photo_url: string;
    status: 'Pending' | 'Confirmed' | 'Rejected';
  };
  birthday_benefit_requested?: boolean;
  birthday_benefit_details?: {
    gov_id_number: string;
    dob: string;
    gov_id_photo_url: string;
    status: 'Pending' | 'Approved' | 'Rejected';
  };
  created_at: string;
}

export interface Preorder {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  style_desc: string;
  image_urls: string[];
  size: string;
  color: string;
  sole: string;
  budget_range: string;
  notes: string;
  status: 'Under Review' | 'Confirmed' | 'Rejected';
  admin_note?: string;
  estimated_delivery?: string;
  created_at: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount_percent: number;
  banner_url: string;
  valid_until: string;
  is_active: boolean;
}

export interface ContentBlock {
  id: string;
  key: string;
  value: string; // usually JSON or plain text
}
