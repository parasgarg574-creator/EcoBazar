import { createContext, useContext, useState, useEffect, useMemo } from "react";
const ShopContext = createContext(null);
const WISHLIST_STORAGE_KEY = "ecobazar_wishlist";
const CART_STORAGE_KEY = "ecobazar_cart";
export const ShopProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        try {
            const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    useEffect(() => {
        try {
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
        } catch (e) {
            console.error("Failed to persist wishlist", e);
        }
    }, [wishlist]);
    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        } catch (e) {
            console.error("Failed to persist cart", e);
        }
    }, [cart]);
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
        setWishlist((prev) => {
            if (prev.some((item) => item._id === product._id)) {
                return prev;
            }
            showToast(`Added "${product.name || 'Product'}" to your Wishlist ❤️`);
            return [...prev, product];
        });
    };
    const removeFromWishlist = (productId) => {
        if (!productId) return;
        setWishlist((prev) => {
            const removed = prev.find((item) => (item._id || item.id) === productId);
            if (removed) {
                showToast(`Removed "${removed.name || 'Product'}" from Wishlist`);
            }
            return prev.filter((item) => (item._id || item.id) !== productId);
        });
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
        setCart((prev) => {
            const index = prev.findIndex((item) => item.product._id === product._id);
            if (index > -1) {
                const updated = [...prev];
                const newQty = updated[index].quantity + qty;
                const stock = Number(product.stock) || 999;
                updated[index] = {
                    ...updated[index],
                    quantity: Math.min(newQty, stock),
                };
                return updated;
            } else {
                return [...prev, { product, quantity: qty }];
            }
        });
        showToast(`Added ${qty} × "${product.name || 'Product'}" to Cart 🛒`);
        if (openDrawer) {
            setIsCartOpen(true);
        }
    };
    const removeFromCart = (productId) => {
        if (!productId) return;
        setCart((prev) => prev.filter((item) => item.product._id !== productId));
    };
    const updateCartQuantity = (productId, quantity) => {
        if (!productId) return;
        const newQty = Number(quantity);
        if (newQty <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prev) =>
            prev.map((item) => {
                if (item.product._id === productId) {
                    const stock = Number(item.product.stock) || 999;
                    return {
                        ...item,
                        quantity: Math.min(newQty, stock),
                    };
                }
                return item;
            })
        );
    };
    const clearCart = () => {
        setCart([]);
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
