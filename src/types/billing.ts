export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  createdAt: string;
}

export interface BillItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  items: BillItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  createdAt: string;
}
