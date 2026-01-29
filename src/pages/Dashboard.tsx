import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useBilling } from '../context/BillingContext';
import { Package, Receipt, DollarSign, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { products, bills } = useBilling();

  const today = new Date().toDateString();
  const todaysBills = bills.filter(
    (bill) => new Date(bill.createdAt).toDateString() === today
  );
  const todaysSales = todaysBills.reduce((sum, bill) => sum + bill.grandTotal, 0);
  const totalSales = bills.reduce((sum, bill) => sum + bill.grandTotal, 0);

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Total Bills',
      value: bills.length,
      icon: Receipt,
      color: 'bg-success/10 text-success',
    },
    {
      title: "Today's Sales",
      value: `₹${todaysSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'bg-warning/10 text-warning',
    },
    {
      title: 'Total Sales',
      value: `₹${totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'bg-chart-4/10 text-chart-4',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to BillEasy - Your offline billing solution
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Bills</CardTitle>
          </CardHeader>
          <CardContent>
            {bills.length === 0 ? (
              <p className="text-muted-foreground text-sm">No bills yet. Create your first bill!</p>
            ) : (
              <div className="space-y-3">
                {bills.slice(-5).reverse().map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{bill.billNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {bill.customerName || 'Walk-in Customer'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-success">
                        ₹{bill.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(bill.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            {products.filter((p) => p.stock < 10).length === 0 ? (
              <p className="text-muted-foreground text-sm">All products are well stocked!</p>
            ) : (
              <div className="space-y-3">
                {products
                  .filter((p) => p.stock < 10)
                  .slice(0, 5)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.code}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${product.stock === 0 ? 'text-destructive' : 'text-warning'}`}>
                          {product.stock} left
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
