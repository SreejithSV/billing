import { useState, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Search, Eye, Printer, Trash2, History } from 'lucide-react';
import type { Bill } from '../types/billing';
import { toast } from 'sonner';
import { PrintBill } from '../components/PrintBill';
import { useReactToPrint } from 'react-to-print';
import { useBilling } from '../context/BillingContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function BillHistory() {
  const { bills, deleteBill } = useBilling();
  const [search, setSearch] = useState('');
  const [viewingBill, setViewingBill] = useState<Bill | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Bill | null>(null);
  const [printingBill, setPrintingBill] = useState<Bill | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const filteredBills = bills
    .filter(
      (b) =>
        b.billNumber.toLowerCase().includes(search.toLowerCase()) ||
        b.customerName.toLowerCase().includes(search.toLowerCase()) ||
        b.customerPhone.includes(search)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteBill(deleteConfirm.id);
      toast.success('Bill deleted successfully!');
      setDeleteConfirm(null);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: printingBill ? `Bill-${printingBill.billNumber}` : 'Bill',
  });

  const handlePrintClick = (bill: Bill) => {
    setPrintingBill(bill);
    setTimeout(() => handlePrint(), 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bill History</h1>
        <p className="text-muted-foreground mt-1">View and manage all your bills</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by bill number, customer name, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {bills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-muted mb-4">
            <History className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No bills yet</h3>
          <p className="text-muted-foreground mt-1">
            Create your first bill to see it here
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Bill Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-mono font-medium text-primary">
                    {bill.billNumber}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(bill.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    {bill.customerName || (
                      <span className="text-muted-foreground italic">Walk-in</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                      {bill.items.length} items
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-success">
                    ₹{bill.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingBill(bill)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePrintClick(bill)}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteConfirm(bill)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* View Bill Dialog */}
      <Dialog open={!!viewingBill} onOpenChange={() => setViewingBill(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Bill Details</DialogTitle>
          </DialogHeader>
          {viewingBill && (
            <div className="space-y-4">
              <Card className="border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex justify-between">
                    <span>{viewingBill.billNumber}</span>
                    <span className="text-muted-foreground font-normal">
                      {new Date(viewingBill.createdAt).toLocaleString('en-IN')}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(viewingBill.customerName || viewingBill.customerPhone) && (
                    <div className="text-sm">
                      {viewingBill.customerName && (
                        <p>
                          <span className="text-muted-foreground">Customer: </span>
                          {viewingBill.customerName}
                        </p>
                      )}
                      {viewingBill.customerPhone && (
                        <p>
                          <span className="text-muted-foreground">Phone: </span>
                          {viewingBill.customerPhone}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="text-xs">Product</TableHead>
                          <TableHead className="text-xs text-right">Qty</TableHead>
                          <TableHead className="text-xs text-right">Price</TableHead>
                          <TableHead className="text-xs text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {viewingBill.items.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-sm">{item.productName}</TableCell>
                            <TableCell className="text-sm text-right">{item.quantity}</TableCell>
                            <TableCell className="text-sm text-right">₹{item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-sm text-right font-medium">
                              ₹{item.total.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{viewingBill.subtotal.toFixed(2)}</span>
                    </div>
                    {viewingBill.discount > 0 && (
                      <div className="flex justify-between text-destructive">
                        <span>Discount</span>
                        <span>-₹{viewingBill.discount.toFixed(2)}</span>
                      </div>
                    )}
                    {viewingBill.tax > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span>+₹{viewingBill.tax.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Grand Total</span>
                      <span className="text-primary">₹{viewingBill.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingBill(null)}>
              Close
            </Button>
            <Button onClick={() => viewingBill && handlePrintClick(viewingBill)}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Bill</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete bill "{deleteConfirm?.billNumber}"? This action cannot
            be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden Print Component */}
      <div className="hidden">
        {printingBill && (
          <PrintBill
            ref={printRef}
            billNumber={printingBill.billNumber}
            date={new Date(printingBill.createdAt).toLocaleDateString('en-IN')}
            customerName={printingBill.customerName}
            customerPhone={printingBill.customerPhone}
            items={printingBill.items}
            subtotal={printingBill.subtotal}
            discount={printingBill.discount}
            tax={printingBill.tax}
            grandTotal={printingBill.grandTotal}
          />
        )}
      </div>
    </div>
  );
}
