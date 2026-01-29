import { useState, useMemo, useRef } from 'react';
import { useBilling } from '../context/BillingContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { toast } from 'sonner';
import { Plus, Trash2, Printer, Save, RotateCcw, Receipt } from 'lucide-react';
import type { BillItem } from '../types/billing';
import { PrintBill } from '../components/PrintBill';
import { useReactToPrint } from 'react-to-print';

export default function NewBill() {
  const { products, addBill, bills } = useBilling();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState<BillItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [savedBill, setSavedBill] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const billNumber = useMemo(() => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const count = bills.filter(
      (b) => b.billNumber.startsWith(`BILL-${dateStr}`)
    ).length;
    return `BILL-${dateStr}-${String(count + 1).padStart(3, '0')}`;
  }, [bills, items]);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxAmount = ((subtotal - discountAmount) * tax) / 100;
  const grandTotal = subtotal - discountAmount + taxAmount;

  const handleAddItem = () => {
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }
    if (quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }
    if (quantity > selectedProduct.stock) {
      toast.error(`Only ${selectedProduct.stock} units available in stock`);
      return;
    }

    const existingItem = items.find((i) => i.productId === selectedProduct.id);
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > selectedProduct.stock) {
        toast.error(`Only ${selectedProduct.stock} units available in stock`);
        return;
      }
      setItems(
        items.map((i) =>
          i.productId === selectedProduct.id
            ? {
                ...i,
                quantity: newQuantity,
                total: newQuantity * i.price,
              }
            : i
        )
      );
    } else {
      setItems([
        ...items,
        {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          quantity,
          price: selectedProduct.sellingPrice,
          total: quantity * selectedProduct.sellingPrice,
        },
      ]);
    }

    setSelectedProductId('');
    setQuantity(1);
    toast.success('Item added to bill');
  };

  const handleRemoveItem = (productId: string) => {
    setItems(items.filter((i) => i.productId !== productId));
  };

  const handleClear = () => {
    setItems([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscount(0);
    setTax(0);
    setSavedBill(null);
  };

  const handleSaveBill = () => {
    if (items.length === 0) {
      toast.error('Please add at least one item to the bill');
      return;
    }

    const billData = {
      billNumber,
      date: new Date().toISOString(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      items,
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      grandTotal,
    };

    addBill(billData);
    setSavedBill({ ...billData, id: 'new' });
    toast.success('Bill saved successfully!');
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Bill-${billNumber}`,
  });

  const handlePrintClick = () => {
    if (!savedBill && items.length > 0) {
      handleSaveBill();
    }
    setTimeout(() => handlePrint(), 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">New Bill</h1>
        <p className="text-muted-foreground mt-1">Create a new bill for your customer</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Bill Header */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Bill Details
                </span>
                <span className="text-primary font-mono">{billNumber}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name (Optional)</Label>
                  <Input
                    id="customerName"
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone Number (Optional)</Label>
                  <Input
                    id="customerPhone"
                    placeholder="Enter phone number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Product */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle>Add Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Select Product</Label>
                  <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Search or select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - ₹{product.sellingPrice} (Stock: {product.stock})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-24 space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>
                <Button onClick={handleAddItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>

              {selectedProduct && (
                <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm">
                  <span className="font-medium">Price: </span>
                  <span className="text-success">
                    ₹{selectedProduct.sellingPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-muted-foreground ml-4">
                    Total: ₹{(selectedProduct.sellingPrice * quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bill Items Table */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle>Bill Items</CardTitle>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No items added yet. Select products above to add them to the bill.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="text-right">
                          ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right font-semibold">
                          ₹{item.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleRemoveItem(item.productId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bill Summary */}
        <div className="space-y-6">
          <Card className="border shadow-sm sticky top-6">
            <CardHeader className="pb-4">
              <CardTitle>Bill Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor="discount" className="text-muted-foreground whitespace-nowrap">
                    Discount (%)
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-20 text-right"
                  />
                  <span className="text-destructive">
                    -₹{discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor="tax" className="text-muted-foreground whitespace-nowrap">
                    Tax (%)
                  </Label>
                  <Input
                    id="tax"
                    type="number"
                    min="0"
                    value={tax}
                    onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                    className="w-20 text-right"
                  />
                  <span className="text-success">
                    +₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Grand Total</span>
                  <span className="text-primary">
                    ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Button onClick={handleSaveBill} className="w-full" disabled={items.length === 0}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Bill
                </Button>
                <Button
                  variant="outline"
                  onClick={handlePrintClick}
                  className="w-full"
                  disabled={items.length === 0}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print Bill
                </Button>
                <Button variant="ghost" onClick={handleClear} className="w-full">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Clear Bill
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden Print Component */}
      <div className="hidden">
        <PrintBill
          ref={printRef}
          billNumber={billNumber}
          date={new Date().toLocaleDateString('en-IN')}
          customerName={customerName}
          customerPhone={customerPhone}
          items={items}
          subtotal={subtotal}
          discount={discountAmount}
          tax={taxAmount}
          grandTotal={grandTotal}
        />
      </div>
    </div>
  );
}
