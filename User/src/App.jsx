import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./Pages/Home";
import Category from "./Pages/Category";
import CategoryDetail from "./Pages/CategoryDetail";
import Products from "./Pages/Products";
import ProductDetail from "./Pages/ProductDetail";
import Wishlist from "./Pages/Wishlist";
import Account from "./Pages/Account";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import LegalContent from "./Pages/LegalContent";
import Faq from "./Pages/Faq";
import { ShopProvider } from "./Context/ShopContext";
import { AuthProvider } from "./Context/AuthContext";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<CategoryDetail />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/*" element={<Checkout />} />
          <Route path="/account" element={<Account />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/:page" element={<LegalContent />} />
          <Route path="/faq" element={<Faq />} />
        </Routes>
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;
