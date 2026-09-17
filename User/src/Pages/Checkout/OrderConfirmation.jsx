import { Link } from "react-router-dom";
import { FiCheckCircle, FiPackage, FiTruck, FiCreditCard, FiArrowRight } from "react-icons/fi";

const OrderConfirmation = ({ order }) => {
    if (!order) {
        return (
            <div className="bg-white rounded-xl border border-[#E6E6E6] p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)] max-w-lg mx-auto">
                <FiPackage size={48} className="text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">No Order Found</h2>
                <p className="text-sm text-[#666666] mb-6">
                    We couldn't retrieve order details. Please check your account dashboard.
                </p>
                <Link
                    to="/account"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#00B207] hover:bg-[#009e06] text-white text-sm font-semibold rounded-full transition"
                >
                    <span>Go to My Account</span>
                    <FiArrowRight size={16} />
                </Link>
            </div>
        );
    }

    const { _id, createdAt, totalAmount, shippingAddress, paymentMethod, paymentStatus, orderItems } = order;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Success Hero Card */}
            <div className="bg-white rounded-xl border border-[#E6E6E6] p-8 sm:p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="w-20 h-20 rounded-full bg-green-100 text-[#00B207] flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <FiCheckCircle size={44} />
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-2">
                    Order Placed Successfully!
                </h1>

                <p className="text-sm text-[#666666] max-w-md mx-auto mb-6">
                    Thank you for your purchase. We have received your order and are preparing it for shipment.
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-xs font-mono font-medium text-[#4D4D4D] border border-gray-200 mb-8">
                    <span>Order ID:</span>
                    <span className="font-bold text-[#1A1A1A]">{_id}</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link
                        to="/account"
                        className="px-7 py-3 bg-[#00B207] hover:bg-[#009e06] text-white text-sm font-semibold rounded-full transition shadow-sm"
                    >
                        View My Orders
                    </Link>
                    <Link
                        to="/products"
                        className="px-7 py-3 bg-[#F2F2F2] hover:bg-[#E6E6E6] text-[#4D4D4D] text-sm font-semibold rounded-full transition"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>

            {/* Detailed Order Breakdown Card */}
            <div className="bg-white rounded-xl border border-[#E6E6E6] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6">
                <h3 className="text-lg font-semibold text-[#1A1A1A] border-b border-[#E6E6E6] pb-3">
                    Order Summary
                </h3>

                {/* Items List */}
                <div className="space-y-4">
                    {orderItems?.map((item, index) => {
                        const product = item.productId || {};
                        return (
                            <div
                                key={item._id || index}
                                className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name || "Product"}
                                                className="w-full h-full object-contain p-1"
                                            />
                                        ) : (
                                            <FiPackage className="text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#1A1A1A]">
                                            {product.name || "Product"}
                                        </p>
                                        <p className="text-xs text-[#666666]">
                                            Qty: {item.quantity} × ${Number(item.price || 0).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-[#1A1A1A]">
                                    ${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Totals & Shipping Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E6E6E6]">
                    <div>
                        <h4 className="text-xs font-semibold uppercase text-[#808080] mb-2 flex items-center gap-1.5">
                            <FiTruck size={14} /> Shipping Information
                        </h4>
                        {typeof shippingAddress === "object" ? (
                            <div className="text-xs text-[#4D4D4D] space-y-0.5">
                                <p className="font-semibold text-sm text-[#1A1A1A]">
                                    {shippingAddress.fullName}
                                </p>
                                <p>{shippingAddress.address}</p>
                                {shippingAddress.apartment && <p>{shippingAddress.apartment}</p>}
                                <p>
                                    {shippingAddress.city}, {shippingAddress.state}{" "}
                                    {shippingAddress.zipCode}
                                </p>
                                <p>{shippingAddress.country}</p>
                                <p className="pt-1 text-[#666666]">Phone: {shippingAddress.phone}</p>
                            </div>
                        ) : (
                            <p className="text-xs text-[#4D4D4D]">{String(shippingAddress)}</p>
                        )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-xs">
                        <div className="flex justify-between text-[#666666]">
                            <span>Payment Method:</span>
                            <span className="font-semibold uppercase text-[#1A1A1A]">{paymentMethod}</span>
                        </div>
                        <div className="flex justify-between text-[#666666]">
                            <span>Payment Status:</span>
                            <span className="font-semibold uppercase text-green-600">{paymentStatus}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-[#1A1A1A] pt-2 border-t border-gray-200">
                            <span>Total Paid:</span>
                            <span className="text-[#00B207]">${Number(totalAmount || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
