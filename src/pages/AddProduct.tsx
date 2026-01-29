import { useState } from 'react';


import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { PlusCircle, Package } from 'lucide-react';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useBilling } from '../context/BillingContext';

export default function AddProduct() {
  const { addProduct } = useBilling();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    costPrice: '',
    sellingPrice: '',
    stock: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.code.trim()) newErrors.code = 'Product code is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.costPrice || parseFloat(formData.costPrice) < 0)
      newErrors.costPrice = 'Valid cost price is required';
    if (!formData.sellingPrice || parseFloat(formData.sellingPrice) < 0)
      newErrors.sellingPrice = 'Valid selling price is required';
    if (!formData.stock || parseInt(formData.stock) < 0)
      newErrors.stock = 'Valid stock quantity is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      addProduct({
        name: formData.name.trim(),
        code: formData.code.trim(),
        category: formData.category.trim(),
        costPrice: parseFloat(formData.costPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        stock: parseInt(formData.stock),
      });
      toast.success('Product added successfully!');
      setFormData({
        name: '',
        code: '',
        category: '',
        costPrice: '',
        sellingPrice: '',
        stock: '',
      });
      setErrors({});
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Add Product</h1>
        <p className="text-muted-foreground mt-1">
          Add new products to your inventory
        </p>
      </div>

      <Card className="max-w-2xl border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Product Code *</Label>
                <Input
                  id="code"
                  placeholder="e.g., PRD001"
                  value={formData.code}
                  onChange={(e) => handleChange('code', e.target.value)}
                  className={errors.code ? 'border-destructive' : ''}
                />
                {errors.code && (
                  <p className="text-sm text-destructive">{errors.code}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  placeholder="e.g., Electronics"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className={errors.category ? 'border-destructive' : ''}
                />
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costPrice">Cost Price (₹) *</Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.costPrice}
                  onChange={(e) => handleChange('costPrice', e.target.value)}
                  className={errors.costPrice ? 'border-destructive' : ''}
                />
                {errors.costPrice && (
                  <p className="text-sm text-destructive">{errors.costPrice}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellingPrice">Selling Price (₹) *</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.sellingPrice}
                  onChange={(e) => handleChange('sellingPrice', e.target.value)}
                  className={errors.sellingPrice ? 'border-destructive' : ''}
                />
                {errors.sellingPrice && (
                  <p className="text-sm text-destructive">{errors.sellingPrice}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  className={errors.stock ? 'border-destructive' : ''}
                />
                {errors.stock && (
                  <p className="text-sm text-destructive">{errors.stock}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
