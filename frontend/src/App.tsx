import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { LoginScreen } from "./features/login/LoginScreen";
import { InvoiceListScreen } from "./features/invoices/InvoiceListScreen";
import { InvoiceDetailScreen } from "./features/invoices/InvoiceDetailScreen";
import { CreateInvoiceScreen } from "./features/invoices/CreateInvoiceScreen";

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
