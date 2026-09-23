import { useState } from "react";
import { useShop } from "../../Context/ShopContext";
import {
    FiCreditCard,
    FiDollarSign,
    FiEdit2,
    FiLock,
    FiAlertCircle,
} from "react-icons/fi";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const PaymentStep = ({ onBack, onSuccess }) => {
    const { cart, cartSubtotal, appliedCoupon, discountAmount, finalTotal, shippingAddress, clearCart, setToastMessage } = useShop();
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [apiError, setApiError] = useState("");
    const loadRazorpay = () =>
        new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    const postJSON = async (endpoint, body) => {
        const token = localStorage.getItem("token");
        const headers = { "Content-Type": "application/json" };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.message || `Request failed: ${endpoint}`);
        }

        return data;
    };

    const finishOrder = (order) => {
        clearCart();
        setToastMessage?.("Order placed successfully!");
        onSuccess?.(order);
    };
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setApiError("");

        if (!shippingAddress) {
            setApiError("Shipping address is missing. Please go back and fill in shipping details.");
            return;
        }

        if (!cart?.length) {
            setApiError("Your cart is empty.");
            return;
        }

        setIsPlacingOrder(true);
        const orderItems = cart.map((item) => ({
            productId: item.product?._id || item._id,
            quantity: Number(item.quantity),
            price: Number(item.product?.price || item.price),
        }));

        if (orderItems.some((item) => !item.productId || !item.quantity || item.quantity < 1)) {
            setApiError("Some cart items are invalid. Please review your cart.");
            setIsPlacingOrder(false);
            return;
        }

        const payload = {
            orderItems,
            shippingAddress,
            paymentMethod: paymentMethod === "cod" ? "cod" : "razorpay",
            discountAmount,
            totalAmount: finalTotal,
            couponCode: appliedCoupon?.couponCode || null,
        };

        try {
            // Cash on Delivery
            if (paymentMethod === "cod") {
                const data = await postJSON("/createorder", {
                    ...payload,
                    paymentStatus: "pending",
                });
                if (!data.success || !data.order) {
                    throw new Error(data.message || "Failed to create COD order.");
                }
                finishOrder(data.order);
                return;
            }

            // Razorpay online payment
            const loaded = await loadRazorpay();
            if (!loaded) {
                throw new Error("Razorpay Checkout could not be loaded. Please try again.");
            }

            const razorpayData = await postJSON("/create-order", {
                amount: finalTotal,
            });

            console.log("Razorpay API Response:", razorpayData);

            if ((!razorpayData.status && !razorpayData.success) || !razorpayData.orders) {
                throw new Error(
                    razorpayData.message || "Unable to create Razorpay order."
                );
            }

            const { orders, key } = razorpayData;
            const options = {
                key: key || import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orders.amount,
                currency: orders.currency || "INR",
                name: "EcoBazar",
                description: "EcoBazar order payment",
                order_id: orders.id,
                handler: async (paymentResponse) => {
                    try {
                        const verifyData = await postJSON("/verify-payment", {
                            razorpay_order_id: paymentResponse.razorpay_order_id,
                            razorpay_payment_id: paymentResponse.razorpay_payment_id,
                            razorpay_signature: paymentResponse.razorpay_signature,
                        });

                        if (!verifyData.success) {
                            throw new Error(verifyData.message || "Payment verification failed.");
                        }
                        const orderData = await postJSON("/createorder", {
                            ...payload,
                            paymentMethod: "razorpay",
                            paymentStatus: "paid",
                            razorpayOrderId: paymentResponse.razorpay_order_id,
                            razorpayPaymentId: paymentResponse.razorpay_payment_id,
                        });

                        if (!orderData.success || !orderData.order) {
                            throw new Error(
                                orderData.message || "Payment verified, but order creation failed. Please contact support."
                            );
                        }

                        finishOrder(orderData.order);
                    } catch (error) {
                        console.error("Payment verification/order error:", error);
                        setApiError(
                            error.message ||
                            "Payment could not be confirmed. If money was deducted, please contact support."
                        );
                    } finally {
                        setIsPlacingOrder(false);
                    }
                },

                modal: {
                    ondismiss: () => setIsPlacingOrder(false),
                },

                theme: { color: "#00B207" },
            };
            const razorpay = new window.Razorpay(options);
            razorpay.on("payment.failed", (response) => {
                setApiError(
                    response.error?.description || "Payment failed. Please try again."
                );
                setIsPlacingOrder(false);
            });

            razorpay.open();
        } catch (error) {
            console.error("Order creation error:", error);
            setApiError(error.message || "Failed to process order. Please try again.");
            setIsPlacingOrder(false);
        }
    };

    return (
        <div className="space-y-6">
            {apiError && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    <FiAlertCircle size={18} className="shrink-0 mt-0.5" />
                    <div>
                        <span className="font-semibold">Payment Error: </span>
                        {apiError}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-[#E6E6E6] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#808080] mb-1">
                        Delivering To
                    </h3>
                    <p className="text-base font-semibold text-[#1A1A1A]">
                        {shippingAddress?.fullName} ({shippingAddress?.phone})
                    </p>
                    <p className="text-sm text-[#666666]">
                        {shippingAddress?.address}
                        {shippingAddress?.apartment ? `, ${shippingAddress.apartment}` : ""}
                        , {shippingAddress?.city}, {shippingAddress?.state}{" "}
                        {shippingAddress?.zipCode}, {shippingAddress?.country}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#E6E6E6] rounded-full text-xs font-semibold text-[#4D4D4D] hover:text-[#00B207] hover:border-[#00B207] transition cursor-pointer shrink-0"
                >
                    <FiEdit2 size={13} />
                    <span>Edit Address</span>
                </button>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white rounded-xl border border-[#E6E6E6] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-3">
                <h3 className="text-base font-semibold text-[#1A1A1A] pb-2 border-b border-[#E6E6E6]">
                    Order Summary
                </h3>
                <div className="flex items-center justify-between text-sm text-[#4D4D4D]">
                    <span>Subtotal ({cart?.length || 0} item{cart?.length === 1 ? "" : "s"}):</span>
                    <span className="font-semibold text-[#1A1A1A]">₹{Number(cartSubtotal || 0).toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                    <div className="flex items-center justify-between text-sm text-[#00B207]">
                        <span>Coupon Discount ({appliedCoupon.couponCode}):</span>
                        <span className="font-semibold">-₹{Number(discountAmount || 0).toFixed(2)}</span>
                    </div>
                )}
                <div className="flex items-center justify-between text-sm text-[#4D4D4D]">
                    <span>Shipping:</span>
                    <span className="font-semibold text-[#1A1A1A]">Free</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#E6E6E6] text-base font-bold text-[#1A1A1A]">
                    <span>Total Payable Amount:</span>
                    <span className="text-lg text-[#00B207]">₹{Number(finalTotal || 0).toFixed(2)}</span>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E6E6E6] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6">
                <h2 className="text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <FiCreditCard className="text-[#00B207]" />
                    <span>Select Payment Method</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                        className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "cod"
                                ? "border-[#00B207] bg-green-50/40"
                                : "border-[#E6E6E6] hover:border-gray-300"
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cod"
                                checked={paymentMethod === "cod"}
                                onChange={() => setPaymentMethod("cod")}
                                className="accent-[#00B207] h-4 w-4"
                            />
                            <FiDollarSign className="text-green-600" size={20} />
                        </div>
                        <span className="font-semibold text-sm text-[#1A1A1A]">
                            Cash on Delivery
                        </span>
                        <span className="text-xs text-[#666666] mt-0.5">
                            Pay with cash upon delivery
                        </span>
                    </label>

                    <label
                        className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "razorpay"
                                ? "border-[#00B207] bg-green-50/40"
                                : "border-[#E6E6E6] hover:border-gray-300"
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="razorpay"
                                checked={paymentMethod === "razorpay"}
                                onChange={() => setPaymentMethod("razorpay")}
                                className="accent-[#00B207] h-4 w-4"
                            />
                            <FiCreditCard className="text-blue-600" size={20} />
                        </div>
                        <span className="font-semibold text-sm text-[#1A1A1A]">
                            Online Payment
                        </span>
                        <span className="text-xs text-[#666666] mt-0.5">
                            UPI, credit/debit card and other available methods
                        </span>
                    </label>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-[#E6E6E6]">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-6 py-3 bg-[#F2F2F2] hover:bg-[#E6E6E6] text-[#4D4D4D] font-semibold text-xs sm:text-sm rounded-full transition cursor-pointer"
                    >
                        Back to Shipping
                    </button>

                    <button
                        type="button"
                        onClick={handlePlaceOrder}
                        disabled={isPlacingOrder}
                        className="px-8 py-3.5 bg-[#00B207] hover:bg-[#009e06] text-white font-semibold text-sm rounded-full transition shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isPlacingOrder ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            <>
                                <FiLock size={16} />
                                <span>
                                    {paymentMethod === "cod" ? "Place Order" : "Pay Now"} (₹
                                    {Number(finalTotal || 0).toFixed(2)})
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default PaymentStep;