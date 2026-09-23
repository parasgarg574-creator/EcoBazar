import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addToCart as addToCartAction,
    addToWishlist as addToWishlistAction,
    clearCart as clearCartAction,
    removeFromCart as removeFromCartAction,
    removeFromWishlist as removeFromWishlistAction,
    updateCartQuantity as updateCartQuantityAction,
} from "../store/shopSlice";

const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { wishlist, cart } = useSelector((state) => state.shop);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage((prev) => (prev === message ? null : prev));
        }, 3000);
    };
    const isInWishlist = (productId) => {
        if (!productId) return false;
        return wishlist.some((item) => (item._id || item.id) === productId);
    };
    const addToWishlist = (product) => {
        if (!product || !product._id) return;
        if (wishlist.some((item) => item._id === product._id)) return;
        dispatch(addToWishlistAction(product));
        showToast(`Added "${product.name || 'Product'}" to your Wishlist ❤️`);
    };
    const removeFromWishlist = (productId) => {
        if (!productId) return;
        const removed = wishlist.find((item) => (item._id || item.id) === productId);
        dispatch(removeFromWishlistAction(productId));
        if (removed) {
            showToast(`Removed "${removed.name || 'Product'}" from Wishlist`);
        }
    };
    const toggleWishlist = (product) => {
        if (!product || !product._id) return;
        if (isInWishlist(product._id)) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product);
        }
    };
    const addToCart = (product, quantity = 1, openDrawer = true) => {
        if (!product || !product._id) return;
        const qty = Math.max(1, Number(quantity) || 1);
        dispatch(addToCartAction({ product, quantity: qty }));
        showToast(`Added ${qty} × "${product.name || 'Product'}" to Cart 🛒`);
        if (openDrawer) {
            setIsCartOpen(true);
        }
    };
    const removeFromCart = (productId) => {
        if (!productId) return;
        dispatch(removeFromCartAction(productId));
    };
    const updateCartQuantity = (productId, quantity) => {
        if (!productId) return;
        dispatch(updateCartQuantityAction({
            productId,
            quantity: Number(quantity),
        }));
    };
    const clearCart = () => {
        dispatch(clearCartAction());
        setAppliedCoupon(null);
    };
    const moveWishlistToCart = (product, removeAfterAdd = false) => {
        if (!product || !product._id) return;
        addToCart(product, 1, true);
        if (removeAfterAdd) {
            removeFromWishlist(product._id);
        }
    };
    const addAllWishlistToCart = () => {
        if (wishlist.length === 0) return;
        wishlist.forEach((product) => {
            if (Number(product.stock) > 0) {
                addToCart(product, 1, false);
            }
        });
        showToast(`Added in-stock wishlist items to your Cart! 🛒`);
        setIsCartOpen(true);
    };
    const cartCount = useMemo(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);
    const cartSubtotal = useMemo(() => {
        return cart.reduce((total, item) => {
            const price = Number(item.product?.price) || 0;
            return total + price * item.quantity;
        }, 0);
    }, [cart]);

    const COUPON_STORAGE_KEY = "ecobazar_applied_coupon";
    const [appliedCoupon, setAppliedCoupon] = useState(() => {
        try {
            const saved = sessionStorage.getItem(COUPON_STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        try {
            if (appliedCoupon) {
                sessionStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
            } else {
                sessionStorage.removeItem(COUPON_STORAGE_KEY);
            }
        } catch (e) {
            console.error("Failed to persist applied coupon", e);
        }
    }, [appliedCoupon]);

    useEffect(() => {
        if (cart.length === 0 && appliedCoupon) {
            setAppliedCoupon(null);
        }
    }, [cart, appliedCoupon]);

    const discountAmount = useMemo(() => {
        if (!appliedCoupon) return 0;
        return Number(appliedCoupon.discountAmount) || 0;
    }, [appliedCoupon]);

    const finalTotal = useMemo(() => {
        if (!appliedCoupon) return cartSubtotal;
        return Math.max(0, cartSubtotal - (Number(appliedCoupon.discountAmount) || 0));
    }, [cartSubtotal, appliedCoupon]);

    const wishlistCount = wishlist.length;
    const SHIPPING_STORAGE_KEY = "ecobazar_shipping";
    const [shippingAddress, setShippingAddress] = useState(() => {
        try {
            const saved = localStorage.getItem(SHIPPING_STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        try {
            if (shippingAddress) {
                localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(shippingAddress));
            } else {
                localStorage.removeItem(SHIPPING_STORAGE_KEY);
            }
        } catch (e) {
            console.error("Failed to persist shipping address", e);
        }
    }, [shippingAddress]);

    const value = {
        wishlist,
        wishlistCount,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        moveWishlistToCart,
        addAllWishlistToCart,
        cart,
        cartCount,
        cartSubtotal,
        appliedCoupon,
        setAppliedCoupon,
        discountAmount,
        finalTotal,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        shippingAddress,
        setShippingAddress,
        toastMessage,
        setToastMessage,
    };
    return (
        <ShopContext.Provider value={value}>
            {children}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 rounded-2xl bg-gray-900/95 px-5 py-3.5 text-sm font-medium text-white shadow-2xl backdrop-blur-md border border-white/10 transition-all duration-300 animate-bounce-short">
                    <span>{toastMessage}</span>
                    <button
                        onClick={() => setToastMessage(null)}
                        className="text-gray-400 hover:text-white transition"
                    >
                        ✕
                    </button>
                </div>
            )}
        </ShopContext.Provider>
    );
};
export const useShop = () => {
    const context = useContext(ShopContext);
    if (!context) {
        throw new Error("useShop must be used within a ShopProvider");
    }
    return context;
};
export default ShopContext;
