import { useState } from "react";
import { useShop } from "../../Context/ShopContext";
import apimethods from "../../Methods/ApiClient";
import { FiCreditCard, FiDollarSign, FiEdit2, FiLock, FiAlertCircle, FiCheck } from "react-icons/fi";

const PaymentStep = ({ onBack, onSuccess }) => {
    const { cart, cartSubtotal, shippingAddress, clearCart, setToastMessage } = useShop();

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [cardDetails, setCardDetails] = useState({
        cardNumber: "",
        cardHolder: "",
        expiry: "",
        cvv: "",
    });
    const [cardErrors, setCardErrors] = useState({});

    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [apiError, setApiError] = useState(null);

    const validateCard = () => {
        if (paymentMethod !== "card") return true;
        const errors = {};
        if (!cardDetails.cardNumber.replace(/\s/g, "")) {
            errors.cardNumber = "Card number is required";
        } else if (cardDetails.cardNumber.replace(/\s/g, "").length < 13) {
            errors.cardNumber = "Invalid card number";
        }
        if (!cardDetails.cardHolder.trim()) {
            errors.cardHolder = "Cardholder name is required";
        }
        if (!cardDetails.expiry.trim()) {
            errors.expiry = "Expiry date required";
        } else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardDetails.expiry.trim())) {
            errors.expiry = "Use MM/YY format";
        }
        if (!cardDetails.cvv.trim()) {
            errors.cvv = "CVV required";
        } else if (cardDetails.cvv.trim().length < 3) {
            errors.cvv = "Invalid CVV";
        }
        setCardErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setApiError(null);
        if (!shippingAddress) {
            setApiError("Shipping address is missing. Please go back and fill in shipping details.");
            return;
        }
        if (paymentMethod === "card" && !validateCard()) {
            return;
        }
        setIsPlacingOrder(true);
        try {
            const orderItemsPayload = cart.map((item) => ({
                productId: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
            }));

            const payload = {
                orderItems: orderItemsPayload,
                shippingAddress,
                paymentMethod,
            };
            const response = await apimethods.postApi("/createorder", payload);
            const data = response.data;

            if (data.success && data.order) {
                clearCart();
                setToastMessage?.("Order placed successfully! 🎉");
                if (onSuccess) {
                    onSuccess(data.order);
                }
            } else {
                throw new Error(data.message || "Failed to place order.");
            }
        } catch (err) {
            console.error("Order creation error:", err);
            const errorMsg =
                err.response?.data?.message ||
                err.message ||
                "Failed to process order. Please try again.";
            setApiError(errorMsg);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* API Error Alert */}
            {apiError && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    <FiAlertCircle size={18} className="shrink-0 text-red-500 mt-0.5" />
                    <div className="flex-1">
                        <span className="font-semibold">Order Error:</span> {apiError}
                    </div>
                </div>
            )}

            {/* Shipping Summary Preview */}
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
                        {shippingAddress?.apartment ? `, ${shippingAddress.apartment}` : ""},{" "}
                        {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.zipCode},{" "}
                        {shippingAddress?.country}
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

            {/* Payment Method Selector */}
            <div className="bg-white rounded-xl border border-[#E6E6E6] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6">
                <h2 className="text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <FiCreditCard className="text-[#00B207]" />
                    <span>Select Payment Method</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Cash on Delivery */}
                    <label
                        className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            paymentMethod === "cod"
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
                        <span className="font-semibold text-sm text-[#1A1A1A]">Cash on Delivery</span>
                        <span className="text-xs text-[#666666] mt-0.5">Pay with cash upon delivery</span>
                    </label>

                    {/* Credit / Debit Card */}
                    <label
                        className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            paymentMethod === "card"
                                ? "border-[#00B207] bg-green-50/40"
                                : "border-[#E6E6E6] hover:border-gray-300"
                        }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="card"
                                checked={paymentMethod === "card"}
                                onChange={() => setPaymentMethod("card")}
                                className="accent-[#00B207] h-4 w-4"
                            />
                            <FiCreditCard className="text-blue-600" size={20} />
                        </div>
                        <span className="font-semibold text-sm text-[#1A1A1A]">Credit/Debit Card</span>
                        <span className="text-xs text-[#666666] mt-0.5">Visa, MasterCard, Amex</span>
                    </label>

                    {/* PayPal */}
                    <label
                        className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            paymentMethod === "paypal"
                                ? "border-[#00B207] bg-green-50/40"
                                : "border-[#E6E6E6] hover:border-gray-300"
                        }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="paypal"
                                checked={paymentMethod === "paypal"}
                                onChange={() => setPaymentMethod("paypal")}
                                className="accent-[#00B207] h-4 w-4"
                            />
                            <span className="font-bold italic text-blue-700 text-sm">PayPal</span>
                        </div>
                        <span className="font-semibold text-sm text-[#1A1A1A]">PayPal</span>
                        <span className="text-xs text-[#666666] mt-0.5">Fast & secure payment</span>
                    </label>
                </div>

                {/* Card Input Fields if Card selected */}
                {paymentMethod === "card" && (
                    <div className="p-5 rounded-xl bg-gray-50 border border-[#E6E6E6] space-y-4 animate-fade-in">
                        <div>
                            <label className="block text-xs font-semibold uppercase text-[#4D4D4D] mb-1">
                                Card Number
                            </label>
                            <input
                                type="text"
                                placeholder="1234 5678 9101 1121"
                                value={cardDetails.cardNumber}
                                onChange={(e) =>
                                    setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                                }
                                className="w-full px-4 py-2.5 border border-[#E6E6E6] rounded-lg text-sm bg-white outline-none focus:border-[#00B207]"
                            />
                            {cardErrors.cardNumber && (
                                <p className="text-xs text-red-500 mt-1">{cardErrors.cardNumber}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-[#4D4D4D] mb-1">
                                Cardholder Name
                            </label>
                            <input
                                type="text"
                                placeholder="JOHN DOE"
                                value={cardDetails.cardHolder}
                                onChange={(e) =>
                                    setCardDetails({ ...cardDetails, cardHolder: e.target.value })
                                }
                                className="w-full px-4 py-2.5 border border-[#E6E6E6] rounded-lg text-sm bg-white outline-none focus:border-[#00B207]"
                            />
                            {cardErrors.cardHolder && (
                                <p className="text-xs text-red-500 mt-1">{cardErrors.cardHolder}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-[#4D4D4D] mb-1">
                                    Expiry Date
                                </label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    value={cardDetails.expiry}
                                    onChange={(e) =>
                                        setCardDetails({ ...cardDetails, expiry: e.target.value })
                                    }
                                    className="w-full px-4 py-2.5 border border-[#E6E6E6] rounded-lg text-sm bg-white outline-none focus:border-[#00B207]"
                                />
                                {cardErrors.expiry && (
                                    <p className="text-xs text-red-500 mt-1">{cardErrors.expiry}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-[#4D4D4D] mb-1">
                                    CVV
                                </label>
                                <input
                                    type="password"
                                    maxLength={4}
                                    placeholder="123"
                                    value={cardDetails.cvv}
                                    onChange={(e) =>
                                        setCardDetails({ ...cardDetails, cvv: e.target.value })
                                    }
                                    className="w-full px-4 py-2.5 border border-[#E6E6E6] rounded-lg text-sm bg-white outline-none focus:border-[#00B207]"
                                />
                                {cardErrors.cvv && (
                                    <p className="text-xs text-red-500 mt-1">{cardErrors.cvv}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Buttons */}
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
                                <span>Place Order (${cartSubtotal.toFixed(2)})</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentStep;
