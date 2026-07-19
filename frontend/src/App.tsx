import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { LoginScreen } from "./features/login/LoginScreen";
import { InvoiceListScreen } from "./features/invoices/invoice-list/InvoiceListScreen";
import { InvoiceDetailScreen } from "./features/invoices/invoice-detail/InvoiceDetailScreen";
import { CreateInvoiceScreen } from "./features/invoices/create-invoice/CreateInvoiceScreen";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<InvoiceListScreen />} />
          <Route path="/invoices/new" element={<CreateInvoiceScreen />} />
          <Route path="/invoices/:id" element={<InvoiceDetailScreen />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
