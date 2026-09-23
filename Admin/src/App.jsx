import { Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense } from "react";
import DashboardLayout from "./Layout/DashboardLayout";
import ProtectedRoute from "./Common/ProtectedRoute";
import Loader from "./Common/Loader";
import Staff from "./Pages/Staff/index";
import Categories from "./Pages/Category/index";
import Product from "./Pages/Product";
import Dashboard from "./Pages/Dashboard";
import ContentManagement from "./Pages/Content";
import Faq from "./Pages/Faq";
import Details from "./Pages/Details";
import Settings from "./Pages/Settings";
import Coupon from "./Pages/Coupon";
const Login = React.lazy(() => import("./Authentication/Login"));
const Forgot = React.lazy(() => import("./Authentication/ForgotPassword"));
const Reset = React.lazy(() => import("./Authentication/ResetPassword"));
const PageFallback = () => (
  <div className="flex min-h-screen w-full items-center justify-center">
    <Loader label="Loading page..." size="lg" />
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
          <Route path="coupon" element={<Coupon />} />
          <Route path="faqs" element={<Faq />} />
          <Route path="settings" element={<Settings />} />
          <Route path="details/:resource/:id" element={<Details />} />
          {/* <Route path="customers" element={<Customers />} /> */}
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
export default App;
