import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import methods from "../../Methods/Validation";
import AuthLayout from "../../Layout/AuthLayout";
import apimethods from "../../Methods/ApiClient";
import Swal from 'sweetalert2'
const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [eyes, setEyes] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidEmail = methods.emailvalidation(email);
  const isValidPassword = methods.passwordValidation(password);
  const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitted(true);
  if (!email || !isValidEmail || !password || !isValidPassword) {
    return;
  }
  try {
    setLoading(true);
    const response = await apimethods.postApi(
      "/public/login",
      {
        email,
        password,
      }
    );
    // `response` is the raw Axios response object; the API's JSON body
    // (the shape the rest of the app expects, e.g. `{ token, data: {...} }`)
    // lives at `response.data`. Storing `response` itself would throw
    // ("Converting circular structure to JSON") because Axios responses
    // contain circular references.
    const result = response?.data;
    localStorage.setItem("response", JSON.stringify(result));
    localStorage.setItem(
      "userPermissions",
      JSON.stringify(result?.data?.permissions || [])
    );
    if (result?.token) {
      localStorage.setItem("token", result.token);
    }
    await Swal.fire({
      title: "Login Successful",
      icon: "success",
      draggable: true,
    });
    navigate("/dashboard");
  } catch (error) {
    console.error("Login failed:", error);
    console.log(
      error.response?.data?.message || "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
};
  return (
      <AuthLayout>
        <div className="mb-6 text-center">
          <img
            src="/Logo.svg"
            alt="Logo"
            className="mx-auto h-auto w-40 sm:w-48"
          />
        </div>
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#00B207] sm:text-3xl">
            Welcome Back
          </h1>

          <p className="mt-1 text-base text-gray-600 sm:text-lg">
            Log In
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-xs placeholder:text-gray-400 focus:ring-2 ${
                submitted && (!email || !isValidEmail)
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-[#00B207] focus:border-[#00B207] focus:ring-green-100"
              }`}
            />
            {submitted && !email && (
              <p className="mt-1.5 text-xs text-red-500">
                Email is required
              </p>
            )}

            {submitted && email && !isValidEmail && (
              <p className="mt-1.5 text-xs text-red-500">
                Please enter a valid email
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={eyes ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 pr-11 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-xs placeholder:text-gray-400 focus:ring-2 ${
                  submitted && (!password || !isValidPassword)
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-[#00B207] focus:border-[#00B207] focus:ring-green-100"
                }`}
              />
              <button
                type="button"
                onClick={() => setEyes((prev) => !prev)}
                aria-label={eyes ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#00B207]"
              >
                {eyes ? (
                  <FaRegEyeSlash size={18} />
                ) : (
                  <FaRegEye size={18} />
                )}
              </button>
            </div>
            {submitted && !password && (
              <p className="mt-1.5 text-xs text-red-500">
                Password is required
              </p>
            )}

            {submitted && password && !isValidPassword && (
              <p className="mt-1.5 text-xs text-red-500">
                Please enter a valid password
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/forgot")}
              className="text-xs font-medium text-gray-500 transition hover:text-[#00B207] hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#00B207] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#009c06] focus:outline-none focus:ring-2 focus:ring-[#00B207] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>
      </AuthLayout>
  );
};
export default Login;
