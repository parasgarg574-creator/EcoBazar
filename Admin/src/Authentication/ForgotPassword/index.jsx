import { NavLink } from "react-router-dom";
import { useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { VscGraph } from "react-icons/vsc";
import AuthLayout from "../../Layout/AuthLayout";
const ForgotPassword = () => {
    const [login, setLogin] = useState({
        email: "",
    });
    const handleChange = (e) => {
        setLogin({
            ...login,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(login)
    };
    return (
        <>
        <div className="min-h-screen flex items-center justify-center p-4">
            <AuthLayout>
                <h1 className="text-[25px] sm:text-[28px] font-medium text-[#00B207] text-center mb-6 sm:mb-7">
                    Forgot Password
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <MdOutlineEmail size={18} />
                            </span>
                            <input id="email" type="email" name="email" value={login.email} onChange={handleChange} placeholder="Enter Email Address" className="w-full h-[48px] sm:h-[50px] pl-10 pr-3 border border-gray-300 rounded-[6px] text-[14px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#1E9ABC]" />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full h-[48px] sm:h-[50px] bg-[#00B207] text-white text-[14px] font-medium rounded-[6px] transition-all duration-200"
                    >
                        Send Reset Link
                    </button>

                </form>
                <p className="text-center text-[12px] sm:text-[13px] text-gray-600 mt-5">
                    Remember Your Password?{" "}
                    <NavLink>Login</NavLink>
                </p>
        </AuthLayout >
        </div>
            </>
        )
    }
export default ForgotPassword