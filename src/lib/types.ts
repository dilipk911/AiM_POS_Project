export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  color: string;
}

export interface TableOrder {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: 'open' | 'closed';
  total: number;
  createdAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface TimeState {
  currentTime: string;
  isOpen: boolean;
}