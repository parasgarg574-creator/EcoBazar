import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Component/Navbar";
import Breadcrumb from "../../Component/Breadcrumb";
import { FiSearch, FiX, FiAlertCircle, FiGrid, FiArrowRight, FiStar } from "react-icons/fi";
import Environment from "../../Environemnt/script";

const FALLBACK_CATEGORY_IMAGE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' fill='%23f3f4f6' rx='16'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

const Skeleton = ({ className = "" }) => (
    <div className={`animate-pulse bg-gray-200 rounded-2xl ${className}`} />
);

const CategoryDetail = () => {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const apiUrl = Environment.api || "http://localhost:5000";
            const response = await fetch(`${apiUrl}/getcategory`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }

            const result = await response.json();
            setCategories(result.data || []);
        } catch (err) {
            console.error("Error fetching categories:", err);
            setError("Failed to load categories. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Filter categories dynamically based on search query (by name or description)
    const filteredCategories = useMemo(() => {
        if (!searchTerm.trim()) return categories;
        const query = searchTerm.toLowerCase().trim();
        return categories.filter(
            (cat) =>
                cat.name?.toLowerCase().includes(query) ||
                cat.description?.toLowerCase().includes(query)
        );
    }, [categories, searchTerm]);

    const handleCategoryClick = (categoryId) => {
        navigate(`/category/${categoryId}`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Dynamic Navbar */}
            <Navbar />

            {/* Dynamic Breadcrumb */}
            <Breadcrumb labels={{ category: "All Categories" }} />

            <main className="flex-1 w-full">
                <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                    
                    {/* Header Banner & Title */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900 px-6 py-10 sm:px-10 sm:py-12 text-white shadow-md">
                        <div className="relative z-10 max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-green-300 mb-4 border border-white/15">
                                <FiGrid size={13} />
                                <span>Browse by Department</span>
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                                All Categories
                            </h1>
                            <p className="mt-3 text-sm text-green-100/90 sm:text-base leading-relaxed">
                                Explore our complete catalog of organic groceries, fresh farm produce, and daily essentials.
                            </p>
                        </div>

                        {/* Background decorative circles */}
                        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                        <div className="absolute right-24 -bottom-16 h-48 w-48 rounded-full bg-emerald-400/10 blur-xl pointer-events-none" />
                    </div>

                    {/* Search & Meta Bar (No filters, only dynamic search) */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-gray-100">
                        {/* Search Input */}
                        <div className="relative w-full sm:max-w-md">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                                <FiSearch size={18} />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search categories..."
                                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-10 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition"
                                    aria-label="Clear search"
                                >
                                    <FiX size={16} />
                                </button>
                            )}
                        </div>

                        {/* Results Count */}
                        <div className="flex items-center gap-2 text-sm text-gray-500 self-start sm:self-center">
                            {!loading && (
                                <span>
                                    Showing{" "}
                                    <strong className="text-gray-800">
                                        {filteredCategories.length}
                                    </strong>{" "}
                                    of {categories.length} {categories.length === 1 ? "category" : "categories"}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-sm border border-red-100">
                            <FiAlertCircle size={48} className="text-red-500 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-800">Unable to load categories</h3>
                            <p className="text-sm text-gray-500 mt-1 max-w-sm">{error}</p>
                            <button
                                onClick={fetchCategories}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Loading Skeletons */}
                    {loading && !error && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl border border-gray-100 bg-white p-4 flex flex-col items-center gap-3"
                                >
                                    <Skeleton className="h-28 w-28 rounded-xl" />
                                    <Skeleton className="h-4 w-3/4 rounded-md" />
                                    <Skeleton className="h-3 w-1/2 rounded-md" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty Search State */}
                    {!loading && !error && filteredCategories.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-16 text-center shadow-sm border border-gray-100">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-4">
                                <FiSearch size={28} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">No categories found</h3>
                            <p className="text-sm text-gray-500 mt-1 max-w-sm">
                                {searchTerm
                                    ? `No categories matched "${searchTerm}". Try a different keyword.`
                                    : "There are currently no categories available."}
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="mt-4 text-sm font-semibold text-green-600 hover:text-green-700 transition"
                                >
                                    Clear search query
                                </button>
                            )}
                        </div>
                    )}

                    {/* Categories Grid */}
                    {!loading && !error && filteredCategories.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 sm:gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {filteredCategories.map((category) => (
                                <div
                                    key={category._id}
                                    onClick={() => handleCategoryClick(category._id)}
                                    className="group relative flex flex-col items-center rounded-2xl border-2 border-gray-100 bg-white p-4 text-center cursor-pointer transition-all duration-300 hover:border-green-500 hover:shadow-lg hover:-translate-y-1"
                                >
                                    {/* Popular Badge */}
                                    {category.ispopular && (
                                        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                                            <FiStar size={10} className="fill-amber-500 text-amber-500" />
                                            <span>Popular</span>
                                        </div>
                                    )}

                                    {/* Category Image Box */}
                                    <div className="flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-gray-50 to-white p-3 mb-3 transition-transform duration-300 group-hover:scale-105">
                                        <img
                                            src={category.image || FALLBACK_CATEGORY_IMAGE}
                                            alt={category.name}
                                            onError={(e) => {
                                                e.target.src = FALLBACK_CATEGORY_IMAGE;
                                            }}
                                            className="h-full w-full object-contain drop-shadow-sm"
                                        />
                                    </div>

                                    {/* Category Name */}
                                    <h2 className="text-sm sm:text-base font-bold text-gray-800 transition-colors group-hover:text-green-600 line-clamp-1">
                                        {category.name}
                                    </h2>

                                    {/* Category Description preview if available */}
                                    {category.description && (
                                        <p className="mt-1 text-xs text-gray-400 line-clamp-1">
                                            {category.description}
                                        </p>
                                    )}

                                    {/* View Products prompt */}
                                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <span>View Products</span>
                                        <FiArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto border-t border-gray-200 bg-white py-8">
                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                        <div className="flex items-center gap-2">
                            <img src="/Logo (1).png" alt="EcoBazar" className="h-8 w-auto object-contain" />
                        </div>
                        <p className="text-xs text-gray-400 text-center">
                            © 2026 EcoBazar. All rights reserved. Fresh &amp; Organic Food.
                        </p>
                        <div className="flex gap-4 text-xs text-gray-400">
                            <a href="#" className="hover:text-green-600 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-green-600 transition-colors">Terms</a>
                            <a href="#" className="hover:text-green-600 transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CategoryDetail;
