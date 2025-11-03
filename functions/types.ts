export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'swords' | 'katanas' | 'daggers';
  price: number;
  originalPrice?: number;
  description: string;
  longDescription: string;
  image: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  specifications: {
    blade_length?: string;
    overall_length?: string;
    weight?: string;
    material?: string;
    handle?: string;
    origin?: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
  shippingAddress: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

