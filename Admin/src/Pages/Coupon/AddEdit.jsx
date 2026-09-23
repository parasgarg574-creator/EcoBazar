import { useState } from "react";
import apimethods from "../../Methods/ApiClient";
import Swal from "sweetalert2";
import { FiX, FiRefreshCw, FiPercent, FiDollarSign, FiTag, FiShoppingBag, FiLock, FiCheck } from "react-icons/fi";

const AddEditCoupon = ({ setShowForm, setCoupons }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountvalue: "",
    minOrderAmount: "0",
    minDiscount: "0",
    maxDiscount: "",
    usageLimit: "",
    expiresAt: "",
  });

  const [errors, setErrors] = useState({});
  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "SAVE";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, code }));
    setErrors((prev) => ({ ...prev, code: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "code" ? value.toUpperCase() : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required";
    }
    if (!formData.discountvalue || Number(formData.discountvalue) <= 0) {
      newErrors.discountvalue = "Discount value must be greater than 0";
    }
    if (formData.discountType === "percentage" && Number(formData.discountvalue) > 100) {
      newErrors.discountvalue = "Percentage discount cannot exceed 100%";
    }
    if (!formData.expiresAt) {
      newErrors.expiresAt = "Expiry date is required";
    } else {
      const selectedDate = new Date(formData.expiresAt);
      if (selectedDate <= new Date()) {
        newErrors.expiresAt = "Expiry date must be in the future";
      }
    }
    if (formData.minDiscount !== "" && Number(formData.minDiscount) < 0) {
      newErrors.minDiscount = "Minimum discount cannot be negative";
    }
    if (formData.maxDiscount !== "" && Number(formData.maxDiscount) < 0) {
      newErrors.maxDiscount = "Maximum discount cannot be negative";
    }
    if (
      formData.minDiscount !== "" &&
      formData.maxDiscount !== "" &&
      Number(formData.minDiscount) > Number(formData.maxDiscount)
    ) {
      newErrors.maxDiscount = "Maximum discount cannot be less than minimum discount";
    }
    if (formData.minOrderAmount !== "" && Number(formData.minOrderAmount) < 0) {
      newErrors.minOrderAmount = "Minimum order amount cannot be negative";
    }

    if (formData.usageLimit !== "" && Number(formData.usageLimit) <= 0) {
      newErrors.usageLimit = "Usage limit must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      code: formData.code.trim().toUpperCase(),
      discountType: formData.discountType,
      discountvalue: Number(formData.discountvalue),
      minOrderAmount: formData.minOrderAmount !== "" ? Number(formData.minOrderAmount) : 0,
      minDiscount: formData.minDiscount !== "" ? Number(formData.minDiscount) : 0,
      maxDiscount: formData.maxDiscount !== "" ? Number(formData.maxDiscount) : null,
      usageLimit: formData.usageLimit !== "" ? Number(formData.usageLimit) : null,
      expiresAt: new Date(formData.expiresAt).toISOString(),
    };

    try {
      const response = await apimethods.postApi("/createCoupon", payload);
      const newCoupon = response?.data?.coupon || response?.data?.data;

      Swal.fire({
        title: "Success!",
        text: response?.data?.message || "Coupon created successfully!",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
      });

      if (setCoupons && newCoupon) {
        setCoupons((prev) => [newCoupon, ...prev]);
      }
      setShowForm(false);
    } catch (error) {
      console.error("Error creating coupon:", error);
      const errorMessage =
        error?.response?.data?.message || error?.message || "Failed to create coupon";
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Create New Coupon</h2>
          <p className="text-xs text-gray-500">Configure parameters for discount voucher</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
        >
          <FiX size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Code & Generator */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-700">
            Coupon Code <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiTag size={16} />
              </span>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g. FESTIVE2026"
                className={`w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm font-mono font-semibold uppercase tracking-wider transition outline-none ${
                  errors.code ? "border-red-400 bg-red-50/50" : "border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600"
                }`}
              />
            </div>
            <button
              type="button"
              onClick={generateRandomCode}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
              title="Generate Random Code"
            >
              <FiRefreshCw size={14} />
              <span>Generate</span>
            </button>
          </div>
          {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code}</p>}
        </div>

        {/* Row 2: Discount Type & Discount Value */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
              Discount Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, discountType: "percentage" }))}
                className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 px-3 text-xs font-medium transition ${
                  formData.discountType === "percentage"
                    ? "border-[#00491B] bg-green-50 text-[#00491B] font-semibold"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FiPercent size={14} />
                <span>Percentage (%)</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, discountType: "fixed" }))}
                className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 px-3 text-xs font-medium transition ${
                  formData.discountType === "fixed"
                    ? "border-[#00491B] bg-green-50 text-[#00491B] font-semibold"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FiDollarSign size={14} />
                <span>Fixed Amount (₹)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
              Discount Value ({formData.discountType === "percentage" ? "%" : "₹"}) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="discountvalue"
              min="0"
              max={formData.discountType === "percentage" ? "100" : undefined}
              step="any"
              value={formData.discountvalue}
              onChange={handleChange}
              placeholder={formData.discountType === "percentage" ? "e.g. 20" : "e.g. 150"}
              className={`w-full rounded-lg border py-2.5 px-3 text-sm transition outline-none ${
                errors.discountvalue ? "border-red-400 bg-red-50/50" : "border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600"
              }`}
            />
            {errors.discountvalue && <p className="mt-1 text-xs text-red-500">{errors.discountvalue}</p>}
          </div>
        </div>

        {/* Row 3: Expiry Date & Minimum Order Amount */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
              Expiry Date & Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={handleChange}
                className={`w-full rounded-lg border py-2.5 px-3 text-sm transition outline-none ${
                  errors.expiresAt ? "border-red-400 bg-red-50/50" : "border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600"
                }`}
              />
            </div>
            {errors.expiresAt && <p className="mt-1 text-xs text-red-500">{errors.expiresAt}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
              Minimum Order Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiShoppingBag size={15} />
              </span>
              <input
                type="number"
                name="minOrderAmount"
                min="0"
                value={formData.minOrderAmount}
                onChange={handleChange}
                placeholder="0 for no minimum"
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm transition outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              />
            </div>
            {errors.minOrderAmount && <p className="mt-1 text-xs text-red-500">{errors.minOrderAmount}</p>}
          </div>
        </div>

        {/* Row 4: Min & Max Discount */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
              Minimum Discount Cap (₹) <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="number"
              name="minDiscount"
              min="0"
              value={formData.minDiscount}
              onChange={handleChange}
              placeholder="0"
              className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm transition outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
            {errors.minDiscount && <p className="mt-1 text-xs text-red-500">{errors.minDiscount}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
              Maximum Discount Cap (₹) <span className="text-gray-400 font-normal">(Optional cap for % off)</span>
            </label>
            <input
              type="number"
              name="maxDiscount"
              min="0"
              value={formData.maxDiscount}
              onChange={handleChange}
              placeholder="Leave empty for no limit"
              className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm transition outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
            {errors.maxDiscount && <p className="mt-1 text-xs text-red-500">{errors.maxDiscount}</p>}
          </div>
        </div>

        {/* Row 5: Usage Limit */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-700">
            Total Usage Limit <span className="text-gray-400 font-normal">(Maximum times this coupon can be redeemed)</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FiLock size={15} />
            </span>
            <input
              type="number"
              name="usageLimit"
              min="1"
              value={formData.usageLimit}
              onChange={handleChange}
              placeholder="Leave empty for unlimited usage"
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm transition outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>
          {errors.usageLimit && <p className="mt-1 text-xs text-red-500">{errors.usageLimit}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-[#00491B] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#019D3E] transition disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <FiCheck size={16} />
            )}
            <span>{loading ? "Creating..." : "Save Coupon"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditCoupon;
