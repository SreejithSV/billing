import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./pages/AddProduct";
import NewBill from "./pages/NewBill";
import BillHistory from "./pages/BillHistory";
import NotFound from "./pages/NotFound";
import { AppLayout } from "./components/AppLayout";
import { BillingProvider } from "./context/BillingContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BillingProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<ProductDetails />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/new-bill" element={<NewBill />} />
              <Route path="/bill-history" element={<BillHistory />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </BillingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
