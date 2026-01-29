import { createContext, useContext, type ReactNode} from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Bill, Product } from '../types/billing';


interface BillingContextType {
  products: Product[];
  bills: Bill[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addBill: (bill: Omit<Bill, 'id' | 'createdAt'>) => void;
  deleteBill: (id: string) => void;
  updateProductStock: (productId: string, quantityChange: number) => void;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export function BillingProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useLocalStorage<Product[]>('billing-products', []);
  const [bills, setBills] = useLocalStorage<Bill[]>('billing-bills', []);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateProductStock = (productId: string, quantityChange: number) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, stock: Math.max(0, p.stock - quantityChange) }
          : p
      )
    );
  };

  const addBill = (bill: Omit<Bill, 'id' | 'createdAt'>) => {
    const newBill: Bill = {
      ...bill,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setBills(prev => [...prev, newBill]);
    
    // Update stock for each item
    bill.items.forEach(item => {
      updateProductStock(item.productId, item.quantity);
    });
  };

  const deleteBill = (id: string) => {
    setBills(prev => prev.filter(b => b.id !== id));
  };

  return (
    <BillingContext.Provider
      value={{
        products,
        bills,
        addProduct,
        updateProduct,
        deleteProduct,
        addBill,
        deleteBill,
        updateProductStock,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
}

export function useBilling() {
  const context = useContext(BillingContext);
  if (context === undefined) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
}
