import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../Component/Navbar";
import Breadcrumb from "../../Component/Breadcrumb";
import { useAuth } from "../../Context/AuthContext";
import { useShop } from "../../Context/ShopContext";
import ShippingForm from "./ShippingForm";
import PaymentStep from "./PaymentStep";
import OrderConfirmation from "./OrderConfirmation";
import { FiCheck, FiShoppingBag, FiTruck, FiCreditCard, FiCheckCircle } from "react-icons/fi";
const Checkout = () => {
    const { isLoggedIn } = useAuth();
    const { cart, shippingAddress } = useShop();
    const navigate = useNavigate();
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState("shipping"); // 'shipping' | 'payment' | 'confirmation'
    const [completedOrder, setCompletedOrder] = useState(null);
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/signin", {
                replace: true,
                state: { from: { pathname: "/checkout" } },
            });
        }
    }, [isLoggedIn, navigate]);

    // Protection check 2: Cart check (unless on confirmation page)
    useEffect(() => {
        if (currentStep !== "confirmation" && (!cart || cart.length === 0)) {
            navigate("/cart", { replace: true });
        }
    }, [cart, currentStep, navigate]);

    const handleShippingSuccess = () => {
        setCurrentStep("payment");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePaymentSuccess = (order) => {
        setCompletedOrder(order);
        setCurrentStep("confirmation");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!isLoggedIn) {
        return null;
    }

    const steps = [
        { id: "cart", label: "Shopping Cart", icon: FiShoppingBag },
        { id: "shipping", label: "Shipping Details", icon: FiTruck },
        { id: "payment", label: "Payment Method", icon: FiCreditCard },
        { id: "confirmation", label: "Order Confirmation", icon: FiCheckCircle },
    ];

    const getStepStatus = (stepId) => {
        if (currentStep === "confirmation") {
            return "completed";
        }
        if (stepId === "cart") return "completed";
        if (stepId === "shipping") {
            if (currentStep === "shipping") return "active";
            return "completed";
        }
        if (stepId === "payment") {
            if (currentStep === "payment") return "active";
            return "upcoming";
        }
        if (stepId === "confirmation") return "upcoming";
        return "upcoming";
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#F7F8F9]">
            <Navbar />
            <Breadcrumb labels={{ checkout: "Checkout" }} />

            <main className="flex-1 w-full py-10 sm:py-12">
                <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">

                    {/* Progress Stepper Bar */}
                    <div className="mb-10 max-w-3xl mx-auto">
                        <div className="flex items-center justify-between relative">
                            {/* Connecting Bar */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0" />
                            <div
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#00B207] transition-all duration-500 z-0"
                                style={{
                                    width:
                                        currentStep === "shipping"
                                            ? "33%"
                                            : currentStep === "payment"
                                            ? "66%"
                                            : "100%",
                                }}
                            />

                            {steps.map((s, index) => {
                                const status = getStepStatus(s.id);
                                const Icon = s.icon;
                                const isCompleted = status === "completed";
                                const isActive = status === "active";

                                return (
                                    <div
                                        key={s.id}
                                        className="relative z-10 flex flex-col items-center group cursor-default"
                                    >
                                        <div
                                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all duration-300 ${
                                                isCompleted
                                                    ? "bg-[#00B207] text-white shadow-md"
                                                    : isActive
                                                    ? "bg-[#00B207] text-white ring-4 ring-green-100 shadow-lg scale-105"
                                                    : "bg-white text-gray-400 border-2 border-gray-200"
                                            }`}
                                        >
                                            {isCompleted ? <FiCheck size={20} /> : <Icon size={20} />}
                                        </div>
                                        <span
                                            className={`mt-2 text-xs sm:text-sm font-medium transition-colors hidden sm:block ${
                                                isActive
                                                    ? "text-[#00B207] font-semibold"
                                                    : isCompleted
                                                    ? "text-[#1A1A1A]"
                                                    : "text-gray-400"
                                            }`}
                                        >
                                            {s.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="max-w-4xl mx-auto">
                        {currentStep === "shipping" && (
                            <ShippingForm onNext={handleShippingSuccess} />
                        )}

                        {currentStep === "payment" && (
                            <PaymentStep
                                onBack={() => setCurrentStep("shipping")}
                                onSuccess={handlePaymentSuccess}
                            />
                        )}

                        {currentStep === "confirmation" && (
                            <OrderConfirmation order={completedOrder} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;
