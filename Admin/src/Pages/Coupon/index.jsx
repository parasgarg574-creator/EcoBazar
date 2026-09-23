import { useEffect, useMemo, useState } from "react";
import AddEditCoupon from "./AddEdit";
import apimethods from "../../Methods/ApiClient";
import Table from "../../Components/Table";
import SearchFilter from "../../Components/SearchFilter";
import Swal from "sweetalert2";
import { FiTag, FiCheckCircle, FiClock, FiPercent, FiDollarSign } from "react-icons/fi";

const Coupon = () => {
  const [showForm, setShowForm] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    discountType: "all",
    isActive: "all",
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await apimethods.getApi("/getCoupons");
      const list = response?.data?.data || response?.data || [];
      setCoupons(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleToggleStatus = async (coupon) => {
    const couponId = coupon._id || coupon.id;
    try {
      const response = await apimethods.putApi(`/toggleCoupon/${couponId}`);
      const updatedCoupon = response?.data?.coupon;
      
      setCoupons((prev) =>
        prev.map((c) => ((c._id || c.id) === couponId ? { ...c, isActive: !c.isActive } : c))
      );

      Swal.fire({
        title: "Status Updated",
        text: response?.data?.message || "Coupon status toggled successfully",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to toggle coupon status:", error);
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message || "Failed to update status",
        icon: "error",
      });
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (!couponId || typeof couponId === "object") {
      console.error("Invalid coupon ID:", couponId);
      return;
    }

    const result = await Swal.fire({
      title: "Delete Coupon?",
      text: "Are you sure you want to delete this coupon? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await apimethods.deleteApi(`/deleteCoupon/${couponId}`);
      setCoupons((prev) => prev.filter((c) => (c._id || c.id) !== couponId));
      
      await Swal.fire({
        title: "Deleted!",
        text: "Coupon has been deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to delete coupon:", error);
      Swal.fire({
        title: "Failed to Delete",
        text: error?.response?.data?.message || "Something went wrong",
        icon: "error",
      });
    }
  };

  // Summary Metrics
  const stats = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter((c) => c.isActive && new Date(c.expiresAt) > new Date()).length;
    const expired = coupons.filter((c) => new Date(c.expiresAt) <= new Date()).length;
    const percentageCount = coupons.filter((c) => c.discountType === "percentage").length;
    const fixedCount = coupons.filter((c) => c.discountType === "fixed").length;
    return { total, active, expired, percentageCount, fixedCount };
  }, [coupons]);

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const term = search.trim().toLowerCase();
      const matchesSearch = !term || coupon?.code?.toLowerCase().includes(term);

      const matchesType =
        !filters.discountType ||
        filters.discountType === "all" ||
        coupon.discountType === filters.discountType;

      const isExpired = new Date(coupon.expiresAt) <= new Date();

      const matchesStatus =
        !filters.isActive ||
        filters.isActive === "all" ||
        (filters.isActive === "active" && coupon.isActive && !isExpired) ||
        (filters.isActive === "inactive" && (!coupon.isActive || isExpired));

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [coupons, search, filters]);

  const columns = [
    {
      key: "code",
      label: "Code",
      render: (coupon) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-green-50 text-[#00491B]">
            <FiTag size={14} />
          </div>
          <span className="font-mono font-bold tracking-wider text-gray-900">{coupon.code}</span>
        </div>
      ),
    },
    {
      key: "discountvalue",
      label: "Discount",
      render: (coupon) => (
        <span className="inline-flex items-center gap-1 font-semibold text-gray-800">
          {coupon.discountType === "percentage" ? (
            <span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700 font-bold">
              {coupon.discountvalue}% OFF
            </span>
          ) : (
            <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 font-bold">
              ₹{coupon.discountvalue} OFF
            </span>
          )}
        </span>
      ),
    },
    {
      key: "minOrderAmount",
      label: "Min Order",
      render: (coupon) => (coupon.minOrderAmount ? `₹${coupon.minOrderAmount}` : <span className="text-gray-400">None</span>),
    },
    {
      key: "maxDiscount",
      label: "Max Discount Cap",
      render: (coupon) => (coupon.maxDiscount ? `₹${coupon.maxDiscount}` : <span className="text-gray-400">Unlimited</span>),
    },
    {
      key: "usedCount",
      label: "Usage",
      render: (coupon) => {
        const limitStr = coupon.usageLimit !== null && coupon.usageLimit !== undefined ? coupon.usageLimit : "∞";
        return (
          <span className="text-xs font-medium text-gray-600">
            {coupon.usedCount || 0} / {limitStr}
          </span>
        );
      },
    },
    {
      key: "expiresAt",
      label: "Expiry Date",
      render: (coupon) => {
        const dateObj = new Date(coupon.expiresAt);
        const isExpired = dateObj <= new Date();
        const formatted = dateObj.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div className="flex flex-col">
            <span className={`text-xs font-medium ${isExpired ? "text-red-600 font-semibold" : "text-gray-700"}`}>
              {formatted}
            </span>
            {isExpired && (
              <span className="mt-0.5 inline-block w-max rounded bg-red-100 px-1.5 py-0.2 text-[10px] font-bold text-red-700">
                EXPIRED
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "isActive",
      label: "Status",
      render: (coupon) => {
        const isExpired = new Date(coupon.expiresAt) <= new Date();
        return (
          <button
            type="button"
            onClick={() => handleToggleStatus(coupon)}
            disabled={isExpired}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isExpired ? "opacity-40 cursor-not-allowed bg-gray-300" : coupon.isActive ? "bg-[#00491B]" : "bg-gray-200"
            }`}
            title={isExpired ? "Coupon expired" : coupon.isActive ? "Click to Deactivate" : "Click to Activate"}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                coupon.isActive && !isExpired ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        );
      },
    },
  ];

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#333] sm:text-[22px]">Coupon Management</h1>
          <p className="text-xs text-gray-500">Create & manage promotional discount coupons for store</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 h-[38px] w-full rounded-[6px] bg-[#00491B] px-4 text-[13px] font-semibold text-white transition hover:bg-[#019D3E] sm:w-auto"
          >
            <FiTag size={16} />
            <span>Create Coupon</span>
          </button>
        )}
      </div>

      {showForm ? (
        <AddEditCoupon setShowForm={setShowForm} setCoupons={setCoupons} />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Total Coupons</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                  <FiTag size={16} />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Active Coupons</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-[#00491B]">
                  <FiCheckCircle size={16} />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-green-700">{stats.active}</p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Expired Coupons</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <FiClock size={16} />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-red-600">{stats.expired}</p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Discount Types</span>
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-600">
                  <span className="flex items-center text-blue-600"><FiPercent size={13} /> {stats.percentageCount}</span>
                  <span>/</span>
                  <span className="flex items-center text-emerald-600"><FiDollarSign size={13} /> {stats.fixedCount}</span>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 font-medium">
                {stats.percentageCount} % Off | {stats.fixedCount} Fixed ₹
              </p>
            </div>
          </div>

          <SearchFilter
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by coupon code..."
            filters={[
              {
                key: "discountType",
                label: "All Types",
                options: [
                  { value: "percentage", label: "Percentage (%)" },
                  { value: "fixed", label: "Fixed Amount (₹)" },
                ],
              },
              {
                key: "isActive",
                label: "All Status",
                options: [
                  { value: "active", label: "Active Only" },
                  { value: "inactive", label: "Inactive / Expired" },
                ],
              },
            ]}
            filterValues={filters}
            onFilterChange={(key, val) => setFilters((prev) => ({ ...prev, [key]: val }))}
            onClear={() => {
              setSearch("");
              setFilters({ discountType: "all", isActive: "all" });
            }}
          />

          {loading ? (
            <div className="flex h-48 items-center justify-center rounded-lg border border-gray-100 bg-white">
              <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#00491B] border-t-transparent" />
            </div>
          ) : (
            <Table
              columns={columns}
              data={filteredCoupons}
              emptyMessage="No coupons found"
              onDelete={handleDeleteCoupon}
              canEdit={false}
            />
          )}
        </>
      )}
    </>
  );
};

export default Coupon;
