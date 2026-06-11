export interface Flower {
  _id: string;
  id?: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image?: string;
  photoIds: string[];
  stockQuantity: number;
  lowStockThreshold?: number;
  unitCost?: number;
  averageRating?: number;
  numReviews?: number;
}

export interface User {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'florist' | 'driver' | 'manager' | 'support';
  profilePicture?: string;
  token: string;
  createdAt?: string;
}

export interface ActivityLog {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    username: string;
    email: string;
  };
  role: 'admin' | 'florist' | 'driver' | 'manager' | 'support';
  action: string;
  targetType: 'Order' | 'Flower' | 'User' | 'System';
  targetId?: string;
  details: string;
  metadata?: any;
  createdAt: string;
}

export interface CartItem extends Flower {
  quantity: number;
}

export interface Order {
  _id: string;
  user?: { fullName: string; email: string };
  recipientName?: string;
  totalAmount: number;
  status: string;
  items: { flower?: { _id: string, name: string, image?: string, photoIds: string[], price: number }; quantity: number }[];
  createdAt: string;
}