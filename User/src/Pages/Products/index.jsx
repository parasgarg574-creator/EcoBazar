import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../Component/Navbar";
import Breadcrumb from "../../Component/Breadcrumb";
import ProductCard from "../../Component/ProductCard";
import apimethods from "../../Methods/ApiClient";
import { FiFilter, FiX, FiChevronLeft, FiChevronRight, FiPackage, FiAlertCircle } from "react-icons/fi";
const Skeleton = ({ className = "" }) => (
    <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);
const SORT_OPTIONS = [
    { value: "createdAt:desc", label: "Newest First" },
    { value: "createdAt:asc", label: "Oldest First" },
    { value: "price:asc", label: "Price: Low → High" },
    { value: "price:desc", label: "Price: High → Low" },
    { value: "name:asc", label: "Name: A → Z" },
];
const PAGE_SIZE = 12;
// ── FilterPanel extracted outside Products to avoid "component created during render" lint error ──
const FilterPanel = ({
    categories,
    categoryFilter,
    localSearch,
    setLocalSearch,
    localMinPrice,
    setLocalMinPrice,
    localMaxPrice,
    setLocalMaxPrice,
    hasActiveFilters,
    onCategoryChange,
    onApply,
    onClear,
}) => (
    <aside className="flex flex-col gap-6">
        {/* Search */}
        {/* <div> */}
            {/* <h3 className="text-sm font-semibold text-gray-800 mb-3">Search</h3> */}
            {/* <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onApply()}
                placeholder="Search products..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-100 outline-none"
            /> */}
        {/* </div> */}

        {/* Categories */}
        {categories.length > 0 && (
            <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Category</h3>
                <div className="flex flex-col gap-1.5">
                    <button
                        onClick={() => onCategoryChange("")}
                        className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                            !categoryFilter
                                ? "bg-green-50 text-green-700 font-medium"
                                : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        All Categories
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() => onCategoryChange(cat._id)}
                            className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                                categoryFilter === cat._id
                                    ? "bg-green-50 text-green-700 font-medium"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {cat.image && (
                                <img src={cat.image} alt="" className="w-5 h-5 object-contain rounded shrink-0" />
                            )}
                            <span className="truncate">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        )}
        <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Price Range</h3>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    value={localMinPrice}
                    onChange={(e) => setLocalMinPrice(e.target.value)}
                    placeholder="Min ₹"
                    min="0"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-100 outline-none"
                />
                <span className="text-gray-400 text-sm shrink-0">–</span>
                <input
                    type="number"
                    value={localMaxPrice}
                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                    placeholder="Max ₹"
                    min="0"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-100 outline-none"
                />
            </div>
        </div>

        <button
            onClick={onApply}
            className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition"
        >
            Apply Filters
        </button>

        {hasActiveFilters && (
            <button
                onClick={onClear}
                className="w-full rounded-lg border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
            >
                Clear All Filters
            </button>
        )}
    </aside>
);

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get("search") || "";
    const categoryFilter = searchParams.get("categoryID") || "";
    const sortParam = searchParams.get("sort") || "createdAt:desc";
    const currentPage = Number(searchParams.get("page") || 1);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [localSearch, setLocalSearch] = useState(searchQuery);
    const [localMinPrice, setLocalMinPrice] = useState(searchParams.get("minPrice") || "");
    const [localMaxPrice, setLocalMaxPrice] = useState(searchParams.get("maxPrice") || "");
    useEffect(() => {
        fetch("http://localhost:5000/getcategory",{
            method:"GET",
            headers:{
                "content-type":"application/json"
            }
        })
        .then((res)=>res.json())
        .then((res) => setCategories(res.data || []))
        .catch(() => {});
    }, []);

    // ── Fetch products when URL params change ─────────────────────────────────
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const [sortField, sortOrder] = sortParam.split(":");
                const params = new URLSearchParams({
                    page: currentPage,
                    limit: PAGE_SIZE,
                    sort: sortField,
                    order: sortOrder,
                });
                if (searchQuery) params.set("search", searchQuery);
                if (categoryFilter) params.set("categoryID", categoryFilter);
                const minPrice = searchParams.get("minPrice");
                const maxPrice = searchParams.get("maxPrice");
                if (minPrice) params.set("minPrice", minPrice);
                if (maxPrice) params.set("maxPrice", maxPrice);

                const res = await fetch(`http://localhost:5000/all?${params.toString()}`,{
                    method:"GET",
                    headers:{
                        "content-type":"application/json"
                    }
                })
                .then((res)=>res.json())
                .then((res) => {
                    setProducts(res.data || []);
                    setTotalPages(res.totalPages || 1);
                    setTotalProducts(res.totalProducts || 0);
                })
                .catch(() => {
                    setError("Failed to load products. Please try again.");
                })
                .finally(() => {
                    setLoading(false);
                });
            } catch {
                setError("Failed to load products. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchParams]);
    const applyFilters = useCallback(() => {
        const params = {};
        if (localSearch.trim()) params.search = localSearch.trim();
        if (categoryFilter) params.categoryID = categoryFilter;
        if (localMinPrice) params.minPrice = localMinPrice;
        if (localMaxPrice) params.maxPrice = localMaxPrice;
        params.sort = sortParam;
        params.page = "1";
        setSearchParams(params);
        setShowFilters(false);
    }, [localSearch, categoryFilter, localMinPrice, localMaxPrice, sortParam, setSearchParams]);

    const handleCategoryChange = (catId) => {
        const params = Object.fromEntries(searchParams.entries());
        if (catId) params.categoryID = catId;
        else delete params.categoryID;
        params.page = "1";
        setSearchParams(params);
    };
    const handleSortChange = (value) => {
        const params = Object.fromEntries(searchParams.entries());
        params.sort = value;
        params.page = "1";
        setSearchParams(params);
    };
    const handlePageChange = (page) => {
        const params = Object.fromEntries(searchParams.entries());
        params.page = page;
        setSearchParams(params);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const clearFilters = () => {
        setLocalSearch("");
        setLocalMinPrice("");
        setLocalMaxPrice("");
        setSearchParams({});
    };
    const hasActiveFilters = !!(searchQuery || categoryFilter || searchParams.get("minPrice") || searchParams.get("maxPrice"));
    const activeCategoryName = categories.find((c) => c._id === categoryFilter)?.name;
    const filterPanelProps = { categories, categoryFilter, localSearch, setLocalSearch, localMinPrice, setLocalMinPrice, localMaxPrice, setLocalMaxPrice, hasActiveFilters, onCategoryChange: handleCategoryChange, onApply: applyFilters, onClear: clearFilters,};
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <Breadcrumb />
            <main className="flex-1 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {activeCategoryName
                                ? activeCategoryName
                                : searchQuery
                                ? `Search: "${searchQuery}"`
                                : "All Products"}
                        </h1>
                        {!loading && !error && (
                            <p className="text-sm text-gray-500 mt-0.5">
                                {totalProducts} product{totalProducts !== 1 ? "s" : ""} found
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={sortParam}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-100 outline-none bg-white"
                        >
                            {SORT_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => setShowFilters(true)}
                            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition lg:hidden"
                        >
                            <FiFilter size={15} />
                            Filters
                            {hasActiveFilters && (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[9px] font-bold text-white">
                                    !
                                </span>
                            )}
                        </button>
                    </div>
                </div>
                <div className="flex gap-8">
                    <div className="hidden lg:block w-56 shrink-0">
                        <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <FilterPanel {...filterPanelProps} />
                        </div>
                    </div>          
                    <div className="flex-1 min-w-0">
                        {error && (
                            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                                <FiAlertCircle size={48} className="text-red-400" />
                                <p className="text-gray-600 font-medium">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-2 rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                        {loading && !error && (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                                    <Skeleton key={i} className="h-[300px]" />
                                ))}
                            </div>
                        )}
                        {!loading && !error && products.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                                <FiPackage size={56} className="text-gray-300" />
                                <h2 className="text-xl font-semibold text-gray-600">No products found</h2>
                                <p className="text-gray-400 text-sm max-w-xs">
                                    Try adjusting your filters or search term.
                                </p>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="mt-2 rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        )}
                        {/* Products grid */}
                        {!loading && !error && products.length > 0 && (
                            <>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                                    {products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>
                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-10 flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            <FiChevronLeft size={16} />
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                            .reduce((acc, p, i, arr) => {
                                                if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                                                acc.push(p);
                                                return acc;
                                            }, [])
                                            .map((p, i) =>
                                                p === "..." ? (
                                                    <span key={`dot-${i}`} className="text-gray-400 px-1 text-sm">…</span>
                                                ) : (
                                                    <button
                                                        key={p}
                                                        onClick={() => handlePageChange(p)}
                                                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                                                            p === currentPage
                                                                ? "bg-green-600 text-white"
                                                                : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                                                        }`}
                                                    >
                                                        {p}
                                                    </button>
                                                )
                                            )}
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            <FiChevronRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
            {showFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setShowFilters(false)}
                    />
                    <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                            <h2 className="font-semibold text-gray-900">Filters</h2>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="text-gray-500 hover:text-gray-700 transition"
                            >
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-5 py-5">
                            <FilterPanel {...filterPanelProps} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Products;
