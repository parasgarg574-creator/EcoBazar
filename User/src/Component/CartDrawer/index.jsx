import { useShop } from "../../Context/ShopContext";
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
const CartDrawer = () => {
    const {
        cart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        closeCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
    } = useShop();
    if (!isCartOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] overflow-hidden">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={closeCart}
            />
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                        <div className="flex items-center gap-2">
                            <FiShoppingBag className="text-green-600" size={20} />
                            <h2 className="text-lg font-bold text-gray-900">
                                Shopping Cart ({cartCount})
                            </h2>
                        </div>
                        <button
                            onClick={closeCart}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                        >
                            <FiX size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        {cart.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-center">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-300 mb-4">
                                    <FiShoppingBag size={36} />
                                </div>
                                <h3 className="text-base font-semibold text-gray-800">Your cart is empty</h3>
                                <p className="mt-1 text-xs text-gray-400 max-w-xs">
                                    Looks like you haven't added any items to your cart yet.
                                </p>
                                <button
                                    onClick={closeCart}
                                    className="mt-6 rounded-xl bg-green-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-green-700 transition"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {cart.map(({ product, quantity }) => {
                                    const price = Number(product.price) || 0;
                                    const stock = Number(product.stock) || 999;
                                    return (
                                        <div key={product._id} className="flex gap-4 py-4">
                                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-2">
                                                <img
                                                    src={product.image || ""}
                                                    alt={product.name}
                                                    className="h-full w-full object-contain"
                                                    onError={(e) => {
                                                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='10' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
                                                    }}
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col justify-between">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">
                                                        {product.name}
                                                    </h4>
                                                    <button
                                                        onClick={() => removeFromCart(product._id)}
                                                        className="text-gray-400 hover:text-red-500 transition"
                                                        title="Remove item"
                                                    >
                                                        <FiTrash2 size={15} />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50/50">
                                                        <button
                                                            onClick={() => updateCartQuantity(product._id, quantity - 1)}
                                                            className="flex h-7 w-7 items-center justify-center text-gray-600 hover:bg-gray-100 transition rounded-l-lg"
                                                        >
                                                            <FiMinus size={12} />
                                                        </button>
                                                        <span className="w-8 text-center text-xs font-semibold text-gray-800">
                                                            {quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateCartQuantity(product._id, quantity + 1)}
                                                            disabled={quantity >= stock}
                                                            className="flex h-7 w-7 items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition rounded-r-lg"
                                                        >
                                                            <FiPlus size={12} />
                                                        </button>
                                                    </div>

                                                    <div className="text-right">
                                                        <span className="text-sm font-bold text-gray-900">
                                                            ₹{(price * quantity).toFixed(2)}
                                                        </span>
                                                        {quantity > 1 && (
                                                            <p className="text-[10px] text-gray-400">
                                                                ₹{price.toFixed(2)} each
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    {cart.length > 0 && (
                        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-5 space-y-4">
                            <div className="flex items-center justify-between text-base font-bold text-gray-900">
                                <span>Subtotal</span>
                                <span>₹{cartSubtotal.toFixed(2)}</span>
                            </div>
                            <p className="text-[11px] text-gray-400">
                                Shipping and taxes calculated at checkout.
                            </p>
                            <div className="flex flex-col gap-2">
                                <Link
                                    to="/cart"
                                    onClick={closeCart}
                                    className="flex w-full items-center justify-center gap-2 rounded-full bg-gray-100 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-200 transition"
                                >
                                    <span>View Shopping Cart</span>
                                </Link>
                                <div className="flex gap-2">
                                    <button
                                        onClick={clearCart}
                                        className="rounded-full border border-gray-200 bg-white px-4 py-3 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Clear Cart
                                    </button>
                                    <Link
                                        to="/cart"
                                        onClick={closeCart}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#00B207] py-3 text-sm font-semibold text-white hover:bg-[#009e06] transition shadow-sm"
                                    >
                                        <span>Checkout</span>
                                        <FiArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default CartDrawer;