import { forwardRef } from 'react';
import type { BillItem } from '../types/billing';

interface PrintBillProps {
  billNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  items: BillItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
}

export const PrintBill = forwardRef<HTMLDivElement, PrintBillProps>(
  (
    {
      billNumber,
      date,
      customerName,
      customerPhone,
      items,
      subtotal,
      discount,
      tax,
      grandTotal,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        style={{
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
          maxWidth: '400px',
          margin: '0 auto',
          backgroundColor: 'white',
          color: 'black',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>BillEasy</h1>
          <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
            Your Trusted Billing Partner
          </p>
          <p style={{ margin: '5px 0', fontSize: '11px', color: '#888' }}>
            Local Business Solutions
          </p>
        </div>

        <hr style={{ border: '1px dashed #ccc', margin: '15px 0' }} />

        {/* Bill Info */}
        <div style={{ marginBottom: '15px', fontSize: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Bill No:</span>
            <strong>{billNumber}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Date:</span>
            <span>{date}</span>
          </div>
          {customerName && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Customer:</span>
              <span>{customerName}</span>
            </div>
          )}
          {customerPhone && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Phone:</span>
              <span>{customerPhone}</span>
            </div>
          )}
        </div>

        <hr style={{ border: '1px dashed #ccc', margin: '15px 0' }} />

        {/* Items */}
        <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <th style={{ textAlign: 'left', padding: '5px 0' }}>Item</th>
              <th style={{ textAlign: 'center', padding: '5px 0' }}>Qty</th>
              <th style={{ textAlign: 'right', padding: '5px 0' }}>Price</th>
              <th style={{ textAlign: 'right', padding: '5px 0' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px dotted #eee' }}>
                <td style={{ padding: '5px 0' }}>{item.productName}</td>
                <td style={{ textAlign: 'center', padding: '5px 0' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right', padding: '5px 0' }}>
                  ₹{item.price.toFixed(2)}
                </td>
                <td style={{ textAlign: 'right', padding: '5px 0' }}>
                  ₹{item.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr style={{ border: '1px dashed #ccc', margin: '15px 0' }} />

        {/* Totals */}
        <div style={{ fontSize: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '5px',
                color: '#d32f2f',
              }}
            >
              <span>Discount:</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
          )}
          {tax > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Tax:</span>
              <span>+₹{tax.toFixed(2)}</span>
            </div>
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '10px',
              paddingTop: '10px',
              borderTop: '2px solid #333',
            }}
          >
            <span>Grand Total:</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <hr style={{ border: '1px dashed #ccc', margin: '20px 0' }} />

        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#666' }}>
          <p style={{ margin: '5px 0' }}>Thank you for your business!</p>
          <p style={{ margin: '5px 0' }}>Visit again</p>
        </div>
      </div>
    );
  }
);

PrintBill.displayName = 'PrintBill';
