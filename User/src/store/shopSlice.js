import { createSlice } from "@reduxjs/toolkit";
const WISHLIST_STORAGE_KEY = "ecobazar_wishlist";
const CART_STORAGE_KEY = "ecobazar_cart";
const readStorage = (key) => {
    if (typeof window === "undefined") return [];
    try {
        const saved = window.localStorage.getItem(key);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};
const initialState = {
    wishlist: readStorage(WISHLIST_STORAGE_KEY),
    cart: readStorage(CART_STORAGE_KEY),
};
const shopSlice = createSlice({
    name: "shop",
    initialState,
    reducers: {
        addToWishlist: (state, action) => {
            const product = action.payload;
            if (!product?._id || state.wishlist.some((item) => item._id === product._id)) {
                return;
            }
            state.wishlist.push(product);
        },
        removeFromWishlist: (state, action) => {
            state.wishlist = state.wishlist.filter(
                (item) => (item._id || item.id) !== action.payload
            );
        },
        addToCart: (state, action) => {
            const { product, quantity } = action.payload;
            if (!product?._id) return;

            const existingItem = state.cart.find(
                (item) => item.product?._id === product._id
            );
            const stock = Number(product.stock) || 999;
            if (existingItem) {
                existingItem.quantity = Math.min(
                    existingItem.quantity + quantity,
                    stock
                );
            } else {
                state.cart.push({
                    product,
                    quantity: Math.min(quantity, stock),
                });
            }
        },
        removeFromCart: (state, action) => {
            state.cart = state.cart.filter(
                (item) => item.product?._id !== action.payload
            );
        },
        updateCartQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.cart.find((cartItem) => cartItem.product?._id === productId);
            if (!item) return;
            if (quantity <= 0) {
                state.cart = state.cart.filter(
                    (cartItem) => cartItem.product?._id !== productId
                );
                return;
            }
            const stock = Number(item.product.stock) || 999;
            item.quantity = Math.min(quantity, stock);
        },
        clearCart: (state) => {
            state.cart = [];
        },
    },
});
export const {  addToWishlist,  removeFromWishlist,  addToCart,  removeFromCart,  updateCartQuantity,  clearCart,} = shopSlice.actions;
export const persistShopState = (store) => {
    if (typeof window === "undefined") return;
    try {
        const { wishlist, cart } = store.getState().shop;
        window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
        console.error("Failed to persist shop state", error);
    }
};
export default shopSlice.reducer;
