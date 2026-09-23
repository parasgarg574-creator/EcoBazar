import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../Component/Navbar";
import Breadcrumb from "../../Component/Breadcrumb";
import { useShop } from "../../Context/ShopContext";
import { FiX, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../../Context/AuthContext";
const FALLBACK_IMAGE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

const Cart = () => {
    const {
        cart,
        cartCount,
        cartSubtotal,
        removeFromCart,
        updateCartQuantity,
        setToastMessage,
        appliedCoupon,
        setAppliedCoupon,
        discountAmount,
        finalTotal,
    } = useShop();
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState("");
    const [couponError, setCouponError] = useState("");
    const handleProceed = () => {
        if (!cart || cart.length === 0) {
            setToastMessage?.("Your cart is empty! Add products before checking out.");
            return;
        }
        if (!isLoggedIn) {
            navigate("/signin", {
                state: { from: { pathname: "/checkout" } },
            });
            return;
        }
        navigate("/checkout");
    };
    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        setCouponError("");
        if (!couponCode.trim()) {
            setCouponError("Please enter a coupon code.");
            return;
        }
        try {
            const response = await fetch("http://localhost:5000/verifyCoupon", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    code: couponCode.trim(),
                    orderAmount: Number(cartSubtotal)
                })
            });
            const data = await response.json();
            if (!response.ok) {
                setAppliedCoupon(null);
                setCouponError(data.message || "Invalid coupon code.");
                return;
            }
            setAppliedCoupon({
                couponCode: data.data.couponCode,
                discountAmount: data.data.discount,
                finalAmount: data.data.finalAmount
            });
            setToastMessage?.(`Coupon "${data.data.couponCode}" applied successfully!`);
        } catch (err) {
            console.error("Coupon verification error:", err);
            setAppliedCoupon(null);
            setCouponError("Unable to verify coupon. Please try again.");
        }
    };
    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
        setCouponError("");
        setToastMessage?.("Coupon removed.");
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#F7F8F9]">
            {/* Dynamic Navbar */}
            <Navbar />

            {/* Dynamic Breadcrumb */}
            <Breadcrumb labels={{ cart: "Shopping Cart" }} />

            <main className="flex-1 w-full py-10 sm:py-12">
                <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
                    {/* Page Heading */}
                    <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#1A1A1A] text-center mb-8">
                        My Shopping Cart
                    </h1>

                    {cartCount === 0 ? (
                        /* Empty State */
                        <div className="bg-white rounded-xl border border-[#E6E6E6] p-12 sm:p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)] max-w-lg mx-auto">
                            <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">
                                <FiShoppingBag size={28} />
                            </div>
                            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                                Your Shopping Cart is Empty
                            </h2>
                            <p className="text-sm text-[#666666] mb-6">
                                You haven't added any products to your cart yet. Explore fresh fruits, vegetables, and groceries.
                            </p>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#00B207] hover:bg-[#009e06] text-white text-sm font-semibold rounded-full transition shadow-sm"
                            >
                                <span>Return to Shop</span>
                                <FiArrowRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        /* 2-Column Cart Layout */
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                            {/* Left Column: Cart Table & Coupon */}
                            <div className="lg:col-span-8 space-y-6">
                                {/* Cart Items Table Card */}
                                <div className="bg-white rounded-xl border border-[#E6E6E6] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse min-w-[650px]">
                                            <thead>
                                                <tr className="border-b border-[#E6E6E6] text-xs font-semibold uppercase text-[#808080] tracking-wider">
                                                    <th className="py-4 px-6 sm:px-8 w-[38%]">Product</th>
                                                    <th className="py-4 px-4 w-[18%]">Price</th>
                                                    <th className="py-4 px-4 w-[24%]">Quantity</th>
                                                    <th className="py-4 px-4 w-[15%]">Subtotal</th>
                                                    <th className="py-4 px-4 sm:px-6 text-right w-[5%]"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#E6E6E6]">
                                                {cart.map(({ product, quantity }) => {
                                                    const price = Number(product.price) || 0;
                                                    const stock = Number(product.stock) || 999;
                                                    const itemSubtotal = price * quantity;

                                                    return (
                                                        <tr
                                                            key={product._id}
                                                            className="hover:bg-gray-50/50 transition-colors"
                                                        >
                                                            {/* Product Image & Title */}
                                                            <td className="py-4 px-6 sm:px-8">
                                                                <div className="flex items-center gap-4">
                                                                    <div
                                                                        onClick={() =>
                                                                            navigate(`/products/${product._id}`)
                                                                        }
                                                                        className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-lg bg-gray-50 p-2 cursor-pointer border border-[#F2F2F2] flex items-center justify-center"
                                                                    >
                                                                        <img
                                                                            src={product.image || FALLBACK_IMAGE}
                                                                            alt={product.name}
                                                                            className="h-full w-full object-contain hover:scale-105 transition-transform"
                                                                            onError={(e) => {
                                                                                e.target.src = FALLBACK_IMAGE;
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <Link
                                                                        to={`/products/${product._id}`}
                                                                        className="text-sm sm:text-base font-medium text-[#1A1A1A] hover:text-[#00B207] transition line-clamp-2"
                                                                    >
                                                                        {product.name}
                                                                    </Link>
                                                                </div>
                                                            </td>

                                                            {/* Price */}
                                                            <td className="py-4 px-4">
                                                                <span className="text-sm sm:text-base font-normal text-[#1A1A1A]">
                                                                    ₹{price.toFixed(2)}
                                                                </span>
                                                            </td>

                                                            {/* Quantity Pill Controls */}
                                                            <td className="py-4 px-4">
                                                                <div className="inline-flex items-center rounded-full border border-[#E6E6E6] bg-white px-2 py-1 gap-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            updateCartQuantity(
                                                                                product._id,
                                                                                quantity - 1
                                                                            )
                                                                        }
                                                                        className="w-7 h-7 rounded-full flex items-center justify-center text-[#666666] hover:bg-[#F2F2F2] hover:text-[#1A1A1A] transition cursor-pointer"
                                                                        aria-label="Decrease quantity"
                                                                    >
                                                                        <FiMinus size={12} />
                                                                    </button>
                                                                    <span className="w-8 text-center text-sm font-medium text-[#1A1A1A]">
                                                                        {quantity}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            updateCartQuantity(
                                                                                product._id,
                                                                                quantity + 1
                                                                            )
                                                                        }
                                                                        disabled={quantity >= stock}
                                                                        className="w-7 h-7 rounded-full flex items-center justify-center text-[#666666] hover:bg-[#F2F2F2] hover:text-[#1A1A1A] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                                                                        aria-label="Increase quantity"
                                                                    >
                                                                        <FiPlus size={12} />
                                                                    </button>
                                                                </div>
                                                            </td>

                                                            {/* Subtotal */}
                                                            <td className="py-4 px-4">
                                                                <span className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                                                                    ₹{itemSubtotal.toFixed(2)}
                                                                </span>
                                                            </td>

                                                            {/* Remove Button */}
                                                            <td className="py-4 px-4 sm:px-6 text-right">
                                                                <button
                                                                    onClick={() =>
                                                                        removeFromCart(product._id)
                                                                    }
                                                                    className="w-7 h-7 rounded-full border border-[#CCCCCC] inline-flex items-center justify-center text-[#808080] hover:text-[#EA4B48] hover:border-[#EA4B48] transition-colors cursor-pointer"
                                                                    aria-label="Remove item from cart"
                                                                    title="Remove"
                                                                >
                                                                    <FiX size={13} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Action Buttons in Table Footer */}
                                    <div className="border-t border-[#E6E6E6] px-6 sm:px-8 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-4 bg-white">
                                        <Link
                                            to="/products"
                                            className="px-6 sm:px-8 py-3 bg-[#F2F2F2] hover:bg-[#E6E6E6] text-[#4D4D4D] font-semibold text-xs sm:text-sm rounded-full transition shadow-sm"
                                        >
                                            Return to shop
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setToastMessage?.("Cart updated successfully! ✓")
                                            }
                                            className="px-6 sm:px-8 py-3 bg-[#F2F2F2] hover:bg-[#E6E6E6] text-[#4D4D4D] font-semibold text-xs sm:text-sm rounded-full transition shadow-sm cursor-pointer"
                                        >
                                            Update Cart
                                        </button>
                                    </div>
                                </div>

                                {/* Coupon Code Card */}
                                <div className="bg-white rounded-xl border border-[#E6E6E6] p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <h3 className="text-lg sm:text-xl font-semibold text-[#1A1A1A] shrink-0">
                                        Coupon Code
                                    </h3>

                                    {appliedCoupon ? (
                                        <div className="flex items-center gap-3 bg-green-50 border border-green-200 px-4 py-2.5 rounded-full">
                                            <span className="text-sm font-semibold text-[#00B207]">
                                                {appliedCoupon.couponCode} applied (-₹{Number(appliedCoupon.discountAmount).toFixed(2)})
                                            </span>
                                            <button
                                                type="button"
                                                onClick={handleRemoveCoupon}
                                                className="text-xs font-semibold text-red-600 hover:text-red-800 underline cursor-pointer"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <form
                                            onSubmit={handleApplyCoupon}
                                            className="flex flex-col sm:flex-row items-center gap-3 w-full md:max-w-md"
                                        >
                                            <div className="w-full relative">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => {
                                                        setCouponCode(e.target.value);
                                                        if (couponError) setCouponError("");
                                                    }}
                                                    placeholder="Enter code"
                                                    className="w-full px-5 py-3 border border-[#E6E6E6] rounded-full text-sm text-[#1A1A1A] placeholder-[#999999] outline-none focus:border-[#00B207] transition bg-white"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full sm:w-auto shrink-0 px-7 sm:px-8 py-3.5 bg-[#333333] hover:bg-[#1A1A1A] text-white font-semibold text-xs sm:text-sm rounded-full transition shadow-sm cursor-pointer whitespace-nowrap"
                                            >
                                                Apply Coupon
                                            </button>
                                        </form>
                                    )}
                                </div>
                                {couponError && (
                                    <p className="text-xs text-red-500 pl-2">{couponError}</p>
                                )}
                            </div>

                            {/* Right Column: Cart Total Card */}
                            <div className="lg:col-span-4">
                                <div className="bg-white rounded-xl border border-[#E6E6E6] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] sticky top-28 space-y-4">
                                    <h2 className="text-xl font-semibold text-[#1A1A1A] pb-2">
                                        Cart Total
                                    </h2>

                                    {/* Subtotal */}
                                    <div className="flex items-center justify-between py-3 border-b border-[#E6E6E6] text-sm text-[#4D4D4D]">
                                        <span>Subtotal:</span>
                                        <span className="font-semibold text-[#1A1A1A]">
                                            ₹{cartSubtotal.toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Shipping */}
                                    <div className="flex items-center justify-between py-3 border-b border-[#E6E6E6] text-sm text-[#4D4D4D]">
                                        <span>Shipping:</span>
                                        <span className="font-semibold text-[#1A1A1A]">Free</span>
                                    </div>

                                    {/* Coupon Discount (if applied) */}
                                    {appliedCoupon && (
                                        <div className="flex items-center justify-between py-3 border-b border-[#E6E6E6] text-sm text-[#00B207]">
                                            <span>
                                                Discount:
                                            </span>

                                            <span className="font-semibold">
                                                -₹{Number(appliedCoupon.discountAmount).toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    {/* Total */}
                                    <div className="flex items-center justify-between py-3 text-base font-normal text-[#1A1A1A]">
                                        <span className="text-sm text-[#4D4D4D]">Total:</span>
                                        <span className="text-lg font-bold text-[#1A1A1A]">
                                            ₹{finalTotal.toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Checkout CTA */}
                                    <button
                                        type="button"
                                        onClick={handleProceed

                                        }
                                        className="w-full py-3.5 bg-[#00B207] hover:bg-[#009e06] text-white font-semibold text-sm rounded-full transition-colors shadow-sm flex items-center justify-center cursor-pointer mt-4"
                                    >
                                        Proceed to checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
export default Cart;
