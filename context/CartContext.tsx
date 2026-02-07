'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import { CartItem } from '@/types';
import toast from 'react-hot-toast';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QTY'; payload: { productId: string; qty: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextType extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        item => item.productId === action.payload.productId,
      );

      if (existingIndex > -1) {
        const newItems = [...state.items];
        const newQty = newItems[existingIndex].qty + action.payload.qty;

        if (newQty > newItems[existingIndex].stock) {
          toast.error('Cannot add more than available stock');
          return state;
        }

        newItems[existingIndex].qty = newQty;
        return { items: newItems };
      }

      return { items: [...state.items, action.payload] };
    }

    case 'REMOVE_ITEM':
      return {
        items: state.items.filter(item => item.productId !== action.payload),
      };

    case 'UPDATE_QTY': {
      const newItems = state.items.map(item =>
        item.productId === action.payload.productId
          ? { ...item, qty: action.payload.qty }
          : item,
      );
      return { items: newItems };
    }

    case 'CLEAR_CART':
      return { items: [] };

    case 'LOAD_CART':
      return { items: action.payload };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: items });
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    toast.success('Added to cart!');
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
    toast.success('Removed from cart');
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty < 1) {
      removeItem(productId);
      return;
    }

    const item = state.items.find(i => i.productId === productId);
    if (item && qty > item.stock) {
      toast.error('Cannot exceed available stock');
      return;
    }

    dispatch({ type: 'UPDATE_QTY', payload: { productId, qty } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const cartCount = state.items.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = state.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
