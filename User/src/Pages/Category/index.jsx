import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../Component/Navbar";
import Breadcrumb from "../../Component/Breadcrumb";
import ProductCard from "../../Component/ProductCard";
import apimethods from "../../Methods/ApiClient";
import { FiAlertCircle, FiPackage } from "react-icons/fi";

const Skeleton = ({ className = "" }) => (
    <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

const CategoryProducts = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [catRes, prodRes] = await Promise.all([
                    fetch("http://localhost:5000/getcategory",{
                        method:"GET",
                        headers:{
                            "content-type":"application/json"
                        }
                    }),
                    fetch(`http://localhost:5000/all?categoryID=${id}`,{
                        method:"GET",
                        headers:{
                            "content-type":"application/json"
                        }
                    })
                ]);
                const catData = await catRes.json();
                const prodData = await prodRes.json();
                const found = catData.data.find((c) => c._id === id);
                setCategory(found || null);
                setProducts(prodData.data || []);
            } catch {
                setError("Failed to load products. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Labels for breadcrumb: maps the category id → category name
    const breadcrumbLabels = {
        category: "Category",
        [id]: category?.name || "Category",
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <Breadcrumb labels={breadcrumbLabels} />

            <main className="flex-1 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">

                {/* Page header */}
                <div className="mb-8">
                    {loading ? (
                        <Skeleton className="h-8 w-48" />
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                {category?.name || "Category"}
                            </h1>
                            {!error && (
                                <p className="mt-1 text-sm text-gray-500">
                                    {products.length} product{products.length !== 1 ? "s" : ""} found
                                </p>
                            )}
                        </>
                    )}
                </div>

                {/* Error state */}
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

                {/* Loading state */}
                {loading && !error && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <Skeleton key={i} className="h-[280px]" />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && products.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                        <FiPackage size={56} className="text-gray-300" />
                        <h2 className="text-xl font-semibold text-gray-600">No products found</h2>
                        <p className="text-gray-400 text-sm max-w-xs">
                            There are no products in this category yet. Check back later!
                        </p>
                    </div>
                )}

                {/* Product grid */}
                {!loading && !error && products.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

            </main>
        </div>
    );
};

export default CategoryProducts;