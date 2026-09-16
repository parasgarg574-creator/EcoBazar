import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../Component/Navbar";
import Breadcrumb from "../../Component/Breadcrumb";
import { useAuth } from "../../Context/AuthContext";
import Environment from "../../Environemnt/script";
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";

const SignIn = () => {
    const { login, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);
    const [loading, setLoading] = useState(false);

    const apiUrl = Environment.api || "http://localhost:5000";
    const from = location.state?.from?.pathname || "/account";

    const validate = () => {
        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);

        if (!validate()) return;

        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/public/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to sign in. Please check your credentials.");
            }

            login(data.data, data.token);
            navigate(from, { replace: true });
        } catch (err) {
            setApiError(err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#F7F8F9]">
            <Navbar />
            <Breadcrumb labels={{ signin: "Sign In", login: "Sign In" }} />

            <main className="flex-1 w-full py-12 sm:py-16 flex items-center justify-center px-4">
                <div className="w-full max-w-[480px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E6E6E6] p-8 sm:p-10">
                    <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#1A1A1A] text-center mb-6">
                        Sign In
                    </h1>

                    {apiError && (
                        <div className="mb-5 flex items-start gap-2.5 rounded-lg bg-red-50 p-3.5 border border-red-200 text-red-700 text-xs sm:text-sm">
                            <FiAlertCircle size={17} className="shrink-0 text-red-500 mt-0.5" />
                            <span>{apiError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                        {/* Email Field */}
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors({ ...errors, email: "" });
                                }}
                                placeholder="Email"
                                className={`w-full px-4 py-3 sm:py-3.5 border rounded-md text-sm text-[#1A1A1A] placeholder-[#999999] outline-none transition-all bg-white ${
                                    errors.email
                                        ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                        : "border-[#E6E6E6] focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207]"
                                }`}
                            />
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password) setErrors({ ...errors, password: "" });
                                    }}
                                    placeholder="Password"
                                    className={`w-full px-4 py-3 sm:py-3.5 pr-11 border rounded-md text-sm text-[#1A1A1A] placeholder-[#999999] outline-none transition-all bg-white ${
                                        errors.password
                                            ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                            : "border-[#E6E6E6] focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207]"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#999999] hover:text-[#4D4D4D] transition-colors"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember me & Forget Password */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none text-xs sm:text-sm text-[#666666]">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 rounded border-[#CCCCCC] text-[#00B207] accent-[#00B207] cursor-pointer"
                                />
                                <span>Remember me</span>
                            </label>

                            <button
                                type="button"
                                onClick={() => alert("Password reset functionality will be available soon.")}
                                className="text-xs sm:text-sm text-[#666666] hover:text-[#1A1A1A] transition-colors"
                            >
                                Forget Password
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 sm:py-3.5 bg-[#00B207] hover:bg-[#009e06] text-white font-semibold text-sm rounded-full transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer mt-2"
                        >
                            {loading ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                <span>Login</span>
                            )}
                        </button>
                    </form>

                    {/* Bottom Link */}
                    <p className="text-center text-xs sm:text-sm text-[#666666] mt-6">
                        Don't have account?{" "}
                        <Link
                            to="/signup"
                            className="font-semibold text-[#1A1A1A] hover:text-[#00B207] transition-colors ml-1"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default SignIn;
