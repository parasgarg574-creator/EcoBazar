import { useEffect, useState } from "react";
import { FiBox, FiGrid, FiUsers } from "react-icons/fi";
import apimethods from "../../Methods/ApiClient";

const StatCard = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${color}`}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className="truncate text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [counts, setCounts] = useState({
    products: 0,
    categories: 0,
    staff: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [productsRes, categoriesRes, staffRes] = await Promise.all([
          apimethods.getApi("/all"),
          apimethods.getApi("/getcategory"),
          apimethods.getApi("/getStaff"),
        ]);

        const products =
          productsRes?.data?.totalProducts ??
          productsRes?.data?.data?.length ??
          0;
        const categories = Array.isArray(categoriesRes?.data?.data)
          ? categoriesRes.data.data.length
          : 0;
        const staff = Array.isArray(staffRes?.data?.data)
          ? staffRes.data.data.length
          : 0;

        setCounts({ products, categories, staff });
      } catch (error) {
        console.error("Failed to load dashboard summary:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCounts();
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-[#333] sm:text-[22px]">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<FiBox className="text-white" size={22} />}
          label="Products"
          value={loading ? "-" : counts.products}
          color="bg-green-600"
        />
        <StatCard
          icon={<FiGrid className="text-white" size={22} />}
          label="Categories"
          value={loading ? "-" : counts.categories}
          color="bg-blue-600"
        />
        <StatCard
          icon={<FiUsers className="text-white" size={22} />}
          label="Staff"
          value={loading ? "-" : counts.staff}
          color="bg-purple-600"
        />
      </div>
    </div>
  );
};
export default Dashboard;
