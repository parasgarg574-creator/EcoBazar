import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../Component/Navbar";
import Breadcrumb from "../../Component/Breadcrumb";
import { useAuth } from "../../Context/AuthContext";
import { useShop } from "../../Context/ShopContext";
import Environment from "../../Environemnt/script";
import apimethods from "../../Methods/ApiClient";
import {
    FiUser,
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiCheckCircle,
    FiAlertCircle,
    FiLogOut,
    FiHeart,
    FiShoppingBag,
    FiArrowRight,
    FiShield,
    FiPackage,
} from "react-icons/fi";

const Account = () => {
    const { user, isLoggedIn, firstLetter, login, logout } = useAuth();
    const { wishlistCount, cartCount, openCart } = useShop();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("login");
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
        rememberMe: true,
    });
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [loginErrors, setLoginErrors] = useState({});
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginApiError, setLoginApiError] = useState(null);
    const [signupData, setSignupData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
    });
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [signupErrors, setSignupErrors] = useState({});
    const [signupLoading, setSignupLoading] = useState(false);
    const [signupApiError, setSignupApiError] = useState(null);
    const [signupSuccessMessage, setSignupSuccessMessage] = useState(null);

    const apiUrl = Environment.api || "http://localhost:5000";
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };
    const validateLoginForm = () => {
        const errors = {};
        if (!loginData.email.trim()) {
            errors.email = "Email address is required";
        } else if (!validateEmail(loginData.email)) {
            errors.email = "Please enter a valid email address";
        }

        if (!loginData.password) {
            errors.password = "Password is required";
        } else if (loginData.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }

        setLoginErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const validateSignupForm = () => {
        const errors = {};
        if (!signupData.name.trim()) {
            errors.name = "Full name is required";
        } else if (signupData.name.trim().length < 2) {
            errors.name = "Name must be at least 2 characters";
        }
        if (!signupData.email.trim()) {
            errors.email = "Email address is required";
        } else if (!validateEmail(signupData.email)) {
            errors.email = "Please enter a valid email address";
        }
        if (!signupData.password) {
            errors.password = "Password is required";
        } else if (signupData.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }
        if (!signupData.confirmPassword) {
            errors.confirmPassword = "Please confirm your password";
        } else if (signupData.password !== signupData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }
        if (!signupData.acceptTerms) {
            errors.acceptTerms = "You must agree to the Terms of Service";
        }

        setSignupErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginApiError(null);

        if (!validateLoginForm()) return;

        setLoginLoading(true);
        try {
            const res = await fetch(`${apiUrl}/public/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: loginData.email.trim().toLowerCase(),
                    password: loginData.password,
                }),
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to sign in. Please check your credentials.");
            }
            login(data.data, data.token);
        } catch (err) {
            setLoginApiError(err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setLoginLoading(false);
        }
    };
    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setSignupApiError(null);
        setSignupSuccessMessage(null);
        if (!validateSignupForm()) return;
        setSignupLoading(true);
        try {
            const res = await fetch(`${apiUrl}/public/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: signupData.name.trim(),
                    email: signupData.email.trim().toLowerCase(),
                    password: signupData.password,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to create account. Please try again.");
            }
            const loginRes = await fetch(`${apiUrl}/public/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: signupData.email.trim().toLowerCase(),
                    password: signupData.password,
                }),
            });

            const loginResult = await loginRes.json();
            if (loginRes.ok && loginResult.success) {
                login(loginResult.data, loginResult.token);
            } else {
                setSignupSuccessMessage("Account created successfully! Please sign in.");
                setActiveTab("login");
                setLoginData((prev) => ({ ...prev, email: signupData.email }));
            }
        } catch (err) {
            setSignupApiError(err.message || "An error occurred during registration.");
        } finally {
            setSignupLoading(false);
        }
    };

    const [userOrders, setUserOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const token = localStorage.getItem("token")
    useEffect(() => {
        if (isLoggedIn) {
            setOrdersLoading(true);

            fetch("http://localhost:5000/getorder", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                     Authorization: `Bearer ${token}`
                },
                // credentials: "include"
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data?.success && Array.isArray(data.orders)) {
                        setUserOrders(data.orders);
                    }
                })
                .catch((err) => {
                    console.error("Error fetching user orders:", err);
                })
                .finally(() => {
                    setOrdersLoading(false);
                });
        }
    }, [isLoggedIn]);
    if (isLoggedIn && user) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Navbar />
                <Breadcrumb labels={{ account: "My Account" }} />

                <main className="flex-1 w-full py-10">
                    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
                        <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-gray-100 text-center sm:text-left">
                                <div className="flex flex-col sm:flex-row items-center gap-5">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-green-600 to-emerald-500 text-3xl font-extrabold text-white shadow-lg shadow-green-200">
                                        {firstLetter || "U"}
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                                            <h1 className="text-2xl font-bold text-gray-900">
                                                {user.name}
                                            </h1>
                                            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 capitalize">
                                                {user.role || "Member"}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Account Status:{" "}
                                            <span className="text-green-600 font-medium">Active</span>
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={logout}
                                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-200 transition"
                                >
                                    <FiLogOut size={15} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                                <div
                                    onClick={() => navigate("/wishlist")}
                                    className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-5 cursor-pointer transition hover:border-green-300 hover:bg-white hover:shadow-md"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-500">
                                            <FiHeart size={22} className="fill-red-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-800">My Wishlist</h3>
                                            <p className="text-xs text-gray-400">
                                                {wishlistCount} item{wishlistCount !== 1 ? "s" : ""} saved
                                            </p>
                                        </div>
                                    </div>
                                    <FiArrowRight
                                        size={18}
                                        className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all"
                                    />
                                </div>
                                <div
                                    onClick={openCart}
                                    className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-5 cursor-pointer transition hover:border-green-300 hover:bg-white hover:shadow-md"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                            <FiShoppingBag size={22} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-800">Shopping Cart</h3>
                                            <p className="text-xs text-gray-400">
                                                {cartCount} item{cartCount !== 1 ? "s" : ""} in cart
                                            </p>
                                        </div>
                                    </div>
                                    <FiArrowRight
                                        size={18}
                                        className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <FiPackage className="text-[#00B207]" />
                                <span>Recent Orders</span>
                            </h2>

                            {ordersLoading ? (
                                <div className="py-8 text-center text-gray-400 text-sm">
                                    Loading your order history...
                                </div>
                            ) : userOrders.length === 0 ? (
                                <div className="py-8 text-center text-gray-400 text-sm">
                                    No orders placed yet.
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {userOrders.map((ord) => (
                                        <div key={ord._id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
                                            <div>
                                                <span className="font-mono text-xs font-semibold text-gray-700">#{ord._id}</span>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(ord.createdAt).toLocaleDateString()} • {ord.orderItems?.length || 0} item(s)
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 capitalize">
                                                    {ord.paymentStatus}
                                                </span>
                                                <span className="font-bold text-gray-900">
                                                    ₹{Number(ord.totalAmount || 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Store Navigation Banner */}
                        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 to-green-900 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold">Explore Fresh &amp; Organic Products</h2>
                                <p className="text-xs text-green-100/80 mt-1">
                                    Discover seasonal fruits, farm fresh vegetables, and organic pantry essentials.
                                </p>
                            </div>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-green-800 shadow-md hover:bg-green-50 transition shrink-0"
                            >
                                <span>Shop Now</span>
                                <FiArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // ── Authentication (Login / Signup) Form ────────────────────────────────────
    return (
        <div className="flex flex-col min-h-screen bg-[#F7F8F9]">
            {/* Dynamic Navbar */}
            <Navbar />

            {/* Dynamic Breadcrumb */}
            <Breadcrumb
                labels={{
                    account: activeTab === "login" ? "Sign In" : "Create Account",
                }}
            />

            <main className="flex-1 w-full py-12 sm:py-16 flex items-center justify-center px-4">
                <div className="w-full max-w-[480px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E6E6E6] p-8 sm:p-10">
                    <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#1A1A1A] text-center mb-6">
                        {activeTab === "login" ? "Sign In" : "Create Account"}
                    </h1>

                    {/* Success Notification */}
                    {signupSuccessMessage && (
                        <div className="mb-5 flex items-start gap-2.5 rounded-lg bg-green-50 p-3.5 border border-green-200 text-green-800 text-xs sm:text-sm">
                            <FiCheckCircle size={17} className="shrink-0 text-[#00B207] mt-0.5" />
                            <span>{signupSuccessMessage}</span>
                        </div>
                    )}

                    {/* ── Login Form ────────────────────────────────────────── */}
                    {activeTab === "login" && (
                        <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
                            {loginApiError && (
                                <div className="mb-4 flex items-start gap-2.5 rounded-lg bg-red-50 p-3.5 border border-red-200 text-red-700 text-xs sm:text-sm">
                                    <FiAlertCircle size={17} className="shrink-0 text-red-500 mt-0.5" />
                                    <span>{loginApiError}</span>
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <input
                                    type="email"
                                    value={loginData.email}
                                    onChange={(e) => {
                                        setLoginData({ ...loginData, email: e.target.value });
                                        if (loginErrors.email) {
                                            setLoginErrors({ ...loginErrors, email: "" });
                                        }
                                    }}
                                    placeholder="Email"
                                    className={`w-full px-4 py-3 sm:py-3.5 border rounded-md text-sm text-[#1A1A1A] placeholder-[#999999] outline-none transition-all bg-white ${loginErrors.email
                                            ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                            : "border-[#E6E6E6] focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207]"
                                        }`}
                                />
                                {loginErrors.email && (
                                    <p className="mt-1.5 text-xs text-red-500">{loginErrors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <div className="relative">
                                    <input
                                        type={showLoginPassword ? "text" : "password"}
                                        value={loginData.password}
                                        onChange={(e) => {
                                            setLoginData({ ...loginData, password: e.target.value });
                                            if (loginErrors.password) {
                                                setLoginErrors({ ...loginErrors, password: "" });
                                            }
                                        }}
                                        placeholder="Password"
                                        className={`w-full px-4 py-3 sm:py-3.5 pr-11 border rounded-md text-sm text-[#1A1A1A] placeholder-[#999999] outline-none transition-all bg-white ${loginErrors.password
                                                ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                                : "border-[#E6E6E6] focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207]"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#999999] hover:text-[#4D4D4D] transition-colors"
                                        aria-label="Toggle password visibility"
                                    >
                                        {showLoginPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                                {loginErrors.password && (
                                    <p className="mt-1.5 text-xs text-red-500">{loginErrors.password}</p>
                                )}
                            </div>

                            {/* Remember Me & Forget Password */}
                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2 cursor-pointer select-none text-xs sm:text-sm text-[#666666]">
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        checked={loginData.rememberMe}
                                        onChange={(e) =>
                                            setLoginData({ ...loginData, rememberMe: e.target.checked })
                                        }
                                        className="h-4 w-4 rounded border-[#CCCCCC] text-[#00B207] accent-[#00B207] cursor-pointer"
                                    />
                                    <span>Remember me</span>
                                </label>

                                <button
                                    type="button"
                                    onClick={() => alert("Password reset is currently in development.")}
                                    className="text-xs sm:text-sm text-[#666666] hover:text-[#1A1A1A] transition-colors"
                                >
                                    Forget Password
                                </button>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loginLoading}
                                className="w-full py-3.5 sm:py-3.5 bg-[#00B207] hover:bg-[#009e06] text-white font-semibold text-sm rounded-full transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer mt-2"
                            >
                                {loginLoading ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                    <span>Login</span>
                                )}
                            </button>

                            {/* Footer Link */}
                            <p className="text-center text-xs sm:text-sm text-[#666666] mt-6">
                                Don't have account?{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTab("signup");
                                        setLoginApiError(null);
                                        setLoginErrors({});
                                    }}
                                    className="font-semibold text-[#1A1A1A] hover:text-[#00B207] transition-colors ml-1 cursor-pointer"
                                >
                                    Register
                                </button>
                            </p>
                        </form>
                    )}

                    {/* ── Signup Form ───────────────────────────────────────── */}
                    {activeTab === "signup" && (
                        <form onSubmit={handleSignupSubmit} className="space-y-4" noValidate>
                            {signupApiError && (
                                <div className="mb-4 flex items-start gap-2.5 rounded-lg bg-red-50 p-3.5 border border-red-200 text-red-700 text-xs sm:text-sm">
                                    <FiAlertCircle size={17} className="shrink-0 text-red-500 mt-0.5" />
                                    <span>{signupApiError}</span>
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <input
                                    type="email"
                                    value={signupData.email}
                                    onChange={(e) => {
                                        setSignupData({ ...signupData, email: e.target.value });
                                        if (signupErrors.email) {
                                            setSignupErrors({ ...signupErrors, email: "" });
                                        }
                                    }}
                                    placeholder="Email"
                                    className={`w-full px-4 py-3 sm:py-3.5 border rounded-md text-sm text-[#1A1A1A] placeholder-[#999999] outline-none transition-all bg-white ${signupErrors.email
                                            ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                            : "border-[#E6E6E6] focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207]"
                                        }`}
                                />
                                {signupErrors.email && (
                                    <p className="mt-1.5 text-xs text-red-500">{signupErrors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <div className="relative">
                                    <input
                                        type={showSignupPassword ? "text" : "password"}
                                        value={signupData.password}
                                        onChange={(e) => {
                                            setSignupData({ ...signupData, password: e.target.value });
                                            if (signupErrors.password) {
                                                setSignupErrors({ ...signupErrors, password: "" });
                                            }
                                        }}
                                        placeholder="Password"
                                        className={`w-full px-4 py-3 sm:py-3.5 pr-11 border rounded-md text-sm text-[#1A1A1A] placeholder-[#999999] outline-none transition-all bg-white ${signupErrors.password
                                                ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                                : "border-[#E6E6E6] focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207]"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#999999] hover:text-[#4D4D4D] transition-colors"
                                        aria-label="Toggle password visibility"
                                    >
                                        {showSignupPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                                {signupErrors.password && (
                                    <p className="mt-1.5 text-xs text-red-500">{signupErrors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={signupData.confirmPassword}
                                        onChange={(e) => {
                                            setSignupData({
                                                ...signupData,
                                                confirmPassword: e.target.value,
                                            });
                                            if (signupErrors.confirmPassword) {
                                                setSignupErrors({ ...signupErrors, confirmPassword: "" });
                                            }
                                        }}
                                        placeholder="Confirm Password"
                                        className={`w-full px-4 py-3 sm:py-3.5 pr-11 border rounded-md text-sm text-[#1A1A1A] placeholder-[#999999] outline-none transition-all bg-white ${signupErrors.confirmPassword
                                                ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                                : "border-[#E6E6E6] focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207]"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#999999] hover:text-[#4D4D4D] transition-colors"
                                        aria-label="Toggle confirm password visibility"
                                    >
                                        {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                                {signupErrors.confirmPassword && (
                                    <p className="mt-1.5 text-xs text-red-500">{signupErrors.confirmPassword}</p>
                                )}
                            </div>

                            {/* Terms & Conditions */}
                            <div className="pt-1">
                                <label className="flex items-center gap-2 cursor-pointer select-none text-xs sm:text-sm text-[#666666]">
                                    <input
                                        type="checkbox"
                                        id="acceptTerms"
                                        checked={signupData.acceptTerms}
                                        onChange={(e) => {
                                            setSignupData({ ...signupData, acceptTerms: e.target.checked });
                                            if (signupErrors.acceptTerms) {
                                                setSignupErrors({ ...signupErrors, acceptTerms: "" });
                                            }
                                        }}
                                        className="h-4 w-4 rounded border-[#CCCCCC] text-[#00B207] accent-[#00B207] cursor-pointer"
                                    />
                                    <span>Accept all terms &amp; Conditions</span>
                                </label>
                                {signupErrors.acceptTerms && (
                                    <p className="mt-1.5 text-xs text-red-500">{signupErrors.acceptTerms}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={signupLoading}
                                className="w-full py-3.5 sm:py-3.5 bg-[#00B207] hover:bg-[#009e06] text-white font-semibold text-sm rounded-full transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer mt-2"
                            >
                                {signupLoading ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                    <span>Create Account</span>
                                )}
                            </button>

                            {/* Footer Link */}
                            <p className="text-center text-xs sm:text-sm text-[#666666] mt-6">
                                Already have account{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTab("login");
                                        setSignupApiError(null);
                                        setSignupErrors({});
                                    }}
                                    className="font-semibold text-[#1A1A1A] hover:text-[#00B207] transition-colors ml-1 cursor-pointer"
                                >
                                    Login
                                </button>
                            </p>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Account;
