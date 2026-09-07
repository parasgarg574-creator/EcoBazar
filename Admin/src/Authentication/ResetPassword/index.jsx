import { useState } from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import AuthLayout from "../../Layout/AuthLayout";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
const ResetPassword = () => {
    const [passwords, setPasswords] = useState({
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        if (passwords.password !== passwords.confirmPassword) {
            console.log("Passwords do not match");
            return;
        }

        console.log(passwords);
    };
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <AuthLayout>
                <div className="flex justify-center mb-3 sm:mb-4">
                    <img
                        src="/Logo.svg"
                        alt="Career Connect"
                        width={150}
                        height={80}
                        className="object-contain"
                    />
                </div>
                <h1 className="text-[25px] sm:text-[28px] font-medium text-[#1599BD] text-center mb-6 sm:mb-7">
                    Change Password
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <RiLockPasswordLine size={18} />
                            </span>

                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={passwords.password}
                                onChange={handleChange}
                                placeholder="Enter New Password"
                                className="w-full h-[48px] sm:h-[50px] pl-10 pr-12 border border-gray-300 rounded-[6px] text-[14px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#1E9ABC]"
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#1E9ABC]"
                            >
                                {showPassword ? (
                                    <FaRegEyeSlash size={18} />
                                ) : (
                                    <FaRegEye size={18} />
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="mb-3">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <RiLockPasswordLine size={18} />
                            </span>

                            <input
                                id="confirmPassword"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                value={passwords.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm New Password"
                                className="w-full h-[48px] sm:h-[50px] pl-10 pr-12 border border-gray-300 rounded-[6px] text-[14px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#1E9ABC]"
                                required
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword((prev) => !prev)
                                }
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#1E9ABC]"
                            >
                                {showConfirmPassword ? (
                                    <FaRegEyeSlash size={18} />
                                ) : (
                                    <FaRegEye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-[48px] sm:h-[50px] bg-[#1E9ABC] text-white text-[14px] font-medium rounded-[6px] hover:bg-[#1785a0] transition-all duration-200"
                    >
                        Change Password
                    </button>
                </form>
            </AuthLayout>
        </div>
    );
};

export default ResetPassword;
