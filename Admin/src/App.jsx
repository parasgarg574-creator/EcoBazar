import { Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense } from "react";
import DashboardLayout from "./Layout/DashboardLayout";
import ProtectedRoute from "./Common/ProtectedRoute";
import Staff from "./Pages/Staff/index";
import Categories from "./Pages/Category/index";
import Product from "./Pages/Product";
import Dashboard from "./Pages/Dashboard";
import ContentManagement from "./Pages/Content";
import Faq from "./Pages/Faq";

const Login = React.lazy(() => import("./Authentication/Login"));
const Forgot = React.lazy(() => import("./Authentication/ForgotPassword"));
const Reset = React.lazy(() => import("./Authentication/ResetPassword"));

const PageFallback = () => (
  <div className="flex min-h-screen w-full items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset" element={<Reset />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="staff" element={<Staff />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Product />} />
          <Route path="content-management" element={<ContentManagement />} />
          <Route path="faqs" element={<Faq />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
export default App;
