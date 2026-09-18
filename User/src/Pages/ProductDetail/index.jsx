import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../Component/Navbar";
import Breadcrumb from "../../Component/Breadcrumb";
import ProductCard from "../../Component/ProductCard";
import Footer from "../../Component/Footer";
import apimethods from "../../Methods/ApiClient";
import { useShop } from "../../Context/ShopContext";
import {
    FiShoppingCart,
    FiStar,
    FiMinus,
    FiPlus,
    FiTruck,
    FiShield,
    FiRefreshCw,
    FiAlertCircle,
    FiArrowLeft,
    FiHeart,
} from "react-icons/fi";

const Skeleton = ({ className = "" }) => (
    <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

const StarRating = ({ rating = 4, max = 5 }) => (
    <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
            <FiStar
                key={i}
                size={14}
                className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
            />
        ))}
    </div>
);

const ProductDetail = () => {
    const { id } = useParams();
    const { isInWishlist, toggleWishlist, addToCart } = useShop();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            setQuantity(1);
            try {
              const res = await fetch(`http://localhost:5000/getProduct/${id}`,{
                method:"GET",
                headers:{
                    "content-type":"application/json"
                }
              })
              const data = await res.json();
              console.log(data);

                // const prod = res.data.data;
                setProduct(data);

                // Fetch related products from the same category
                if (data?.data?.category?._id) {
                    const relRes = await fetch(`http://localhost:5000/all?categoryID=${data.data.category._id}&limit=6`)
                    const relatedData = await relRes.json();
                    console.log("related products",relatedData);
                    const related = (relatedData.data || []).filter((p) => p._id !== id);
                    setRelatedProducts(related.slice(0, 5));
                }
            } catch (err) {
                if (err.response?.status === 404) {
                    setError("Product not found.");
                } else {
                    setError("Failed to load product. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);

    // Calculate derived values
    const discountPercent = Number(product?.data?.discount) || 0;
    const price = Number(product?.data?.price) || 0;
    const originalPrice = discountPercent > 0
        ? (price / (1 - discountPercent / 100)).toFixed(2)
        : null;
    const savings = originalPrice ? (Number(originalPrice) - price).toFixed(2) : null;
    const isInStock = Number(product?.data?.stock) > 0;
    const stockCount = Number(product?.data?.stock) || 0;
    const breadcrumbLabels = product
        ? {
              [product.data.category?._id]: product.data.category?.name || "Category",
              [id]: product.data.name,
          }
        : {};

    const handleQuantityChange = (delta) => {
        setQuantity((q) => Math.max(1, Math.min(q + delta, stockCount)));
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Navbar />
                <Breadcrumb />
                <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <Skeleton className="aspect-square rounded-2xl" />
                        <div className="flex flex-col gap-4">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-10 w-1/2" />
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Navbar />
                <Breadcrumb />
                <div className="flex flex-col items-center justify-center flex-1 gap-5 text-center py-24 px-4">
                    <FiAlertCircle size={56} className="text-red-400" />
                    <h1 className="text-2xl font-bold text-gray-800">{error}</h1>
                    <p className="text-gray-500 text-sm max-w-sm">
                        The product you are looking for might have been removed or is temporarily unavailable.
                    </p>
                    <Link
                        to="/products"
                        className="flex items-center gap-2 rounded-xl bg-green-600 px-7 py-3 text-sm font-semibold text-white hover:bg-green-700 transition"
                    >
                        <FiArrowLeft size={15} />
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <Breadcrumb labels={breadcrumbLabels} />

            <main className="flex-1 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Back button ──────────────────────────────────────────── */}
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors mb-6"
                >
                    <FiArrowLeft size={15} />
                    Back to Products
                </Link>

                {/* ── Product main section ─────────────────────────────────── */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:gap-16">

                    {/* Image */}
                    <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                        <div className="aspect-square w-full flex items-center justify-center p-8">
                            <img
                                src={product.data.image || ""}
                                alt={product.data.name}
                                className="max-h-full max-w-full object-contain"
                                onError={(e) => {
                                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
                                }}
                            />
                        </div>
                    </div>

                    {/* Product info */}
                    <div className="flex flex-col gap-5">

                        {/* Category pill */}
                        {product.category?.name && (
                            <Link
                                to={`/category/${product.category._id}`}
                                className="inline-flex w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-100 transition"
                            >
                                {product.category.name}
                            </Link>
                        )}

                        {/* Name */}
                        <h1 className="text-2xl font-bold text-gray-900 leading-snug sm:text-3xl">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <StarRating rating={4} />
                            <span className="text-sm text-gray-500">(No reviews yet)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-end gap-3 flex-wrap">
                            <span className="text-3xl font-extrabold text-gray-900">
                                ₹{price.toFixed(2)}
                            </span>
                            {originalPrice && (
                                <>
                                    <span className="text-lg text-gray-400 line-through">
                                        ₹{originalPrice}
                                    </span>
                                    <span className="rounded-lg bg-orange-500 px-2.5 py-1 text-sm font-bold text-white">
                                        {discountPercent}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Savings callout */}
                        {savings && (
                            <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2 font-medium">
                                🎉 You save ₹{savings} on this purchase!
                            </p>
                        )}

                        {/* Stock */}
                        <div className="flex items-center gap-2">
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                    isInStock
                                        ? "bg-green-50 text-green-700"
                                        : "bg-red-50 text-red-600"
                                }`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                        isInStock ? "bg-green-500" : "bg-red-500"
                                    }`}
                                />
                                {isInStock ? `In Stock (${stockCount} available)` : "Out of Stock"}
                            </span>
                        </div>

                        {/* Description preview */}
                        {product.data.description && (
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                {product.data.description}
                            </p>
                        )}

                        <hr className="border-gray-100" />

                        {/* Quantity + Add to Cart + Wishlist */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            {isInStock && (
                                <>
                                    {/* Quantity selector */}
                                    <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white overflow-hidden w-fit">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            disabled={quantity <= 1}
                                            className="flex h-11 w-11 items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition"
                                        >
                                            <FiMinus size={15} />
                                        </button>
                                        <span className="w-10 text-center text-sm font-semibold text-gray-900">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            disabled={quantity >= stockCount}
                                            className="flex h-11 w-11 items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition"
                                        >
                                            <FiPlus size={15} />
                                        </button>
                                    </div>

                                    {/* Add to Cart button */}
                                    <button
                                        onClick={() => addToCart(product?.data || product, quantity, true)}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 py-3 px-8 text-sm font-bold text-white hover:bg-green-700 transition shadow-sm shadow-green-200 sm:flex-none"
                                    >
                                        <FiShoppingCart size={16} />
                                        Add to Cart
                                    </button>
                                </>
                            )}

                            {!isInStock && (
                                <button
                                    disabled
                                    className="flex items-center justify-center gap-2 rounded-xl bg-gray-200 py-3 px-8 text-sm font-bold text-gray-400 cursor-not-allowed w-full sm:w-auto"
                                >
                                    <FiShoppingCart size={16} />
                                    Out of Stock
                                </button>
                            )}

                            {/* Wishlist Button */}
                            <button
                                onClick={() => toggleWishlist(product?.data || product)}
                                className={`flex items-center justify-center gap-2 rounded-xl border py-3 px-5 text-sm font-semibold transition ${
                                    isInWishlist(id)
                                        ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                <FiHeart
                                    size={16}
                                    className={isInWishlist(id) ? "fill-red-500 text-red-500" : ""}
                                />
                                <span>{isInWishlist(id) ? "In Wishlist" : "Wishlist"}</span>
                            </button>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-3 pt-2">
                            {[
                                { icon: FiTruck, label: "Free Delivery" },
                                { icon: FiShield, label: "Secure Payment" },
                                { icon: FiRefreshCw, label: "Easy Returns" },
                            ].map(({ icon: Icon, label }) => (
                                <div
                                    key={label}
                                    className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-100 bg-white p-3 text-center"
                                >
                                    <Icon size={18} className="text-green-600" />
                                    <span className="text-[10px] font-medium text-gray-600">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Description / Specs tabs ──────────────────────────────── */}
                {product.data.description && (
                    <div className="mt-12 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                        {/* Tab bar */}
                        <div className="flex border-b border-gray-100">
                            {["description", "details"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3.5 text-sm font-semibold capitalize transition-colors ${
                                        activeTab === tab
                                            ? "border-b-2 border-green-600 text-green-700"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="p-6">
                            {activeTab === "description" && (
                                <div className="prose prose-sm max-w-none">
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                        {product.data.description}
                                    </p>
                                </div>
                            )}
                            {activeTab === "details" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { label: "Product Name", value: product.data.name },
                                        { label: "Category", value: product.data.category?.name || "N/A" },
                                        { label: "Price", value: `₹${price.toFixed(2)}` },
                                        { label: "Discount", value: discountPercent > 0 ? `${discountPercent}%` : "No discount" },
                                        { label: "Stock", value: isInStock ? `${stockCount} units` : "Out of stock" },
                                        { label: "Status", value: product.data.isfeatured ? "Featured" : product.data.ispopular ? "Popular" : "Standard" },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex gap-3">
                                            <span className="text-sm text-gray-400 w-36 shrink-0">{label}</span>
                                            <span className="text-sm font-medium text-gray-800">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Related Products ──────────────────────────────────────── */}
                {relatedProducts.length > 0 && (
                    <section className="mt-14">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Related Products</h2>
                            {product.data.category?._id && (
                                <Link
                                    to={`/category/${product.data.category._id}`}
                                    className="text-sm font-semibold text-green-600 hover:text-green-700 transition"
                                >
                                    View All →
                                </Link>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </section>
                )}

            </main>

            <Footer />
        </div>
    );
};

export default ProductDetail;
