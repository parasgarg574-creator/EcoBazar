import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import DashboardLayout from "./Layout/DashboardLayout";
import Staff from "./Pages/Staff/index";
import Categories from "./Pages/Category/index";
import Product from "./Pages/Product";
const Login = React.lazy(() => import("./Authentication/Login"));
const Forgot = React.lazy(() => import("./Authentication/ForgotPassword"));
const Reset = React.lazy(() => import("./Authentication/ResetPassword"));
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/reset" element={<Reset />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        {/* <Route index element={<Dashboard />} /> */}
        <Route path="staff" element={<Staff />} />
        <Route path="categories" element={<Categories />} />
        <Route path="products" element={<Product/>}/>
      </Route>
    </Routes>
  );
}
export default App;
