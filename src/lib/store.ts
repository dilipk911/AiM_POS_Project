import { create } from 'zustand';
import { Product, TableOrder, TimeState } from './types';

interface POSState {
  orders: TableOrder[];
  activeTable: number | null;
  products: Product[];
  timeState: TimeState;
  setActiveTable: (tableNumber: number | null) => void;
  addOrder: (order: TableOrder) => void;
  updateOrder: (orderId: string, items: OrderItem[]) => void;
  updateTime: (time: string) => void;
}

export const usePOSStore = create<POSState>((set) => ({
  orders: [],
  activeTable: null,
  products: [
    {
      id: '1',
      name: 'Food Stay',
      price: 15.99,
      category: 'dine-in',
      color: 'bg-pink-500',
    },
    // Add more products here
  ],
  timeState: {
    currentTime: new Date().toLocaleTimeString(),
    isOpen: true,
  },
  setActiveTable: (tableNumber) =>
    set({ activeTable: tableNumber }),
  addOrder: (order) =>
    set((state) => ({ orders: [...state.orders, order] })),
  updateOrder: (orderId, items) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, items } : order
      ),
    })),
  updateTime: (time) =>
    set((state) => ({
      timeState: { ...state.timeState, currentTime: time },
    })),
}));