import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useShop } from "../../Context/ShopContext";
import { FiMapPin, FiCheck } from "react-icons/fi";

const ShippingForm = ({ onNext }) => {
    const { user } = useAuth();
    const { shippingAddress, setShippingAddress } = useShop();

    const [formData, setFormData] = useState({
        fullName: shippingAddress?.fullName || user?.name || "",
        phone: shippingAddress?.phone || user?.phone || "",
        address: shippingAddress?.address || "",
        apartment: shippingAddress?.apartment || "",
        city: shippingAddress?.city || "",
        state: shippingAddress?.state || "",
        zipCode: shippingAddress?.zipCode || "",
        country: shippingAddress?.country || "United States",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (shippingAddress) {
            setFormData((prev) => ({
                ...prev,
                ...shippingAddress,
            }));
        }
    }, [shippingAddress]);

    const validateField = (name, value) => {
        const val = (value || "").toString().trim();
        switch (name) {
            case "fullName":
                if (!val) return "Full Name is required";
                if (val.length < 2) return "Full Name must be at least 2 characters";
                return "";
            case "phone":
                if (!val) return "Phone number is required";
                if (!/^[0-9+\-\s()]{7,20}$/.test(val)) return "Please enter a valid phone number";
                return "";
            case "address":
                if (!val) return "Street address is required";
                if (val.length < 3) return "Address is too short";
                return "";
            case "city":
                if (!val) return "City is required";
                return "";
            case "state":
                if (!val) return "State/Province is required";
                return "";
            case "zipCode":
                if (!val) return "Postal/ZIP Code is required";
                if (!/^[a-zA-Z0-9\s\-]{3,10}$/.test(val)) return "Please enter a valid postal/ZIP code";
                return "";
            case "country":
                if (!val) return "Country is required";
                return "";
            default:
                return "";
        }
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            if (key !== "apartment") {
                const err = validateField(key, formData[key]);
                if (err) newErrors[key] = err;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (touched[name]) {
            const err = validateField(name, value);
            setErrors((prev) => ({ ...prev, [name]: err }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        const err = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: err }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const allTouched = {};
        Object.keys(formData).forEach((key) => {
            allTouched[key] = true;
        });
        setTouched(allTouched);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const cleanedData = {
                fullName: formData.fullName.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                apartment: formData.apartment.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                zipCode: formData.zipCode.trim(),
                country: formData.country.trim(),
            };
            setShippingAddress(cleanedData);
            if (onNext) onNext(cleanedData);
        } catch (err) {
            console.error("Shipping form error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-[#E6E6E6] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A] mb-6 flex items-center gap-2">
                <FiMapPin className="text-[#00B207]" />
                <span>Shipping Address</span>
            </h2>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Full Name & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase text-[#4D4D4D] mb-1.5">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="John Doe"
                            className={`w-full px-4 py-3 border rounded-lg text-sm text-[#1A1A1A] placeholder-[#999999] outline-none transition-all ${
                                touched.fullName && errors.fullName
                                    ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                    : "border-[#E6E6E6] focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207]"
                            }`}
                        />
                        {touched.fullName && errors.fullName && (
                            <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-[#4D4D4D] mb-1.5">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="+1 (555) 000-0000"
                            className={`w-full px-4 py-3 border rounded-lg text-sm text-[#1A1A1A] placeholder-[#999999] outline-none transition-all ${
                                touched.phone && errors.phone
                                    ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                    : "border-[#E6E6E6] focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207]"
                            }`}
                        />
                        {touched.phone && errors.phone && (
                            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                        )}
                    </div>
                </div>

                {/* Street Address */}
                <div>
                    <label className="block text-xs font-semibold uppercase text-[#4D4D4D] mb-1.5">
                        Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="123 Fresh Produce Way"
                        className={`w-full px-4 py-3 border rounded-lg text-sm text-[#1A1A1A] placeholder-[#999999] outline-none transition-all ${
                            touched.address && errors.address
                                ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                : "border-[#E6E6E6] focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207]"
                        }`}
                    />
                    {touched.address && errors.address && (
                        <p className="mt-1 text-xs text-red-500">{errors.address}</p>
                    )}
                </div>

                {/* Apartment / Suite (Optional) */}
                <div>
                    <label className="block text-xs font-semibold uppercase text-[#4D4D4D] mb-1.5">
                        Apartment, Suite, Unit, etc. <span className="text-[#999999] font-normal">(Optional)</span>
                    </label>
                    <input
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleChange}
                        placeholder="Apt 4B"
                        className="w-full px-4 py-3 border border-[#E6E6E6] rounded-lg text-sm text-[#1A1A1A] placeholder-[#999999] outline-none focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207] transition-all"
                    />
                </div>

                {/* City & State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase text-[#4D4D4D] mb-1.5">
                            City <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="New York"
                            className={`w-full px-4 py-3 border rounded-lg text-sm text-[#1A1A1A] placeholder-[#999999] outline-none transition-all ${
                                touched.city && errors.city
                                    ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                    : "border-[#E6E6E6] focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207]"
                            }`}
                        />
                        {touched.city && errors.city && (
                            <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-[#4D4D4D] mb-1.5">
                            State / Province <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="NY"
                            className={`w-full px-4 py-3 border rounded-lg text-sm text-[#1A1A1A] placeholder-[#999999] outline-none transition-all ${
                                touched.state && errors.state
                                    ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                    : "border-[#E6E6E6] focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207]"
                            }`}
                        />
                        {touched.state && errors.state && (
                            <p className="mt-1 text-xs text-red-500">{errors.state}</p>
                        )}
                    </div>
                </div>

                {/* Postal Code & Country */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase text-[#4D4D4D] mb-1.5">
                            Postal / ZIP Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="10001"
                            className={`w-full px-4 py-3 border rounded-lg text-sm text-[#1A1A1A] placeholder-[#999999] outline-none transition-all ${
                                touched.zipCode && errors.zipCode
                                    ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                    : "border-[#E6E6E6] focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207]"
                            }`}
                        />
                        {touched.zipCode && errors.zipCode && (
                            <p className="mt-1 text-xs text-red-500">{errors.zipCode}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-[#4D4D4D] mb-1.5">
                            Country <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 border rounded-lg text-sm text-[#1A1A1A] outline-none transition-all bg-white ${
                                touched.country && errors.country
                                    ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                    : "border-[#E6E6E6] focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207]"
                            }`}
                        >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                            <option value="India">India</option>
                            <option value="Germany">Germany</option>
                        </select>
                        {touched.country && errors.country && (
                            <p className="mt-1 text-xs text-red-500">{errors.country}</p>
                        )}
                    </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3.5 bg-[#00B207] hover:bg-[#009e06] text-white font-semibold text-sm rounded-full transition shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            <>
                                <span>Continue to Payment</span>
                                <FiCheck size={16} />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ShippingForm;
