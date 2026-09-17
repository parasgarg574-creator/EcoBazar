import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../Component/Navbar";
import ProductCard from "../../Component/ProductCard";
import apimethods from "../../Methods/ApiClient";
const FEATURES = [
    { icon: "🚚", title: "Free Shipping", desc: "Free shipping on all orders" },
    { icon: "🕐", title: "24/7 Support", desc: "Instant access to support" },
    { icon: "🔒", title: "Secure Payment", desc: "100% secure transactions" },
    { icon: "↩️", title: "Easy Returns", desc: "30-day money-back guarantee" },
];
const Skeleton = ({ className = "" }) => (
    <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);
const Home = () => {
    const [popularCategories, setPopularCategories] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    fetch("http://localhost:5000/getcategory", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }),
                    fetch("http://localhost:5000/all", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }),
                ]);
                if (!catRes.ok || !prodRes.ok) {
                    throw new Error("Failed to fetch home data");
                }
                const catData = await catRes.json();
                const prodData = await prodRes.json();
                const allCategories = catData.data || [];
                const allProducts = prodData.data || [];
                setPopularCategories(
                    allCategories.filter((c) => c.ispopular)
                );
                setPopularProducts(
                    allProducts.filter((p) => p.ispopular)
                );
                setFeaturedProducts(
                    allProducts.filter((p) => p.isfeatured)
                );
            } catch (err) {
                console.error("Failed to load home data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-1 w-full">
                <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 space-y-12">
                    <section aria-label="Promotions">
                        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-[2fr_1fr] md:h-[450px]">
                            <div className="group relative min-h-[300px] overflow-hidden rounded-md md:min-h-0">
                                <img
                                    src="/banner-main.jpg"
                                    alt="Fresh and healthy organic food"
                                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-900/65 to-transparent" />
                                <div className="absolute left-6 top-1/2 max-w-[330px] -translate-y-1/2 text-white md:left-8">
                                    <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
                                        Fresh &amp; Healthy<br />
                                        Organic Food
                                    </h1>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="text-[10px] text-white/80">
                                            Sale up to
                                        </span>
                                        <span className="rounded-sm bg-orange-500 px-2 py-1 text-[9px] font-bold">
                                            30% OFF
                                        </span>
                                    </div>
                                    <p className="mt-1 text-[9px] text-white/70">
                                        Free shipping on all your order
                                    </p>
                                    <button
                                        onClick={() => navigate("/products")}
                                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-[10px] font-bold text-green-700 transition hover:bg-green-500 hover:text-white"
                                    >
                                        Shop now
                                        <span>→</span>
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-2.5 md:grid-rows-2">
                                <div className="group relative min-h-[180px] overflow-hidden rounded-md md:min-h-0">
                                    <img
                                        src="/banner-sale.jpg"
                                        alt="Summer sale on fresh vegetables"
                                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-transparent" />

                                    <div className="absolute left-5 top-1/2 -translate-y-1/2">
                                        <p className="text-[8px] font-bold uppercase tracking-widest text-gray-600">
                                            Summer Sale
                                        </p>

                                        <h2 className="mt-1 text-2xl font-extrabold leading-none text-gray-900">
                                            75%
                                            <span className="text-base"> OFF</span>
                                        </h2>

                                        <p className="mt-1 text-[8px] text-gray-500">
                                            Only Fruits &amp; Vegetables
                                        </p>

                                        <button
                                            onClick={() => navigate("/products")}
                                            className="mt-2 text-[9px] font-bold text-green-700 transition hover:text-green-900"
                                        >
                                            Shop Now →
                                        </button>
                                    </div>
                                </div>
                                <div className="group relative min-h-[180px] overflow-hidden rounded-md md:min-h-0">
                                    <img
                                        src="/banner-deal.jpg"
                                        alt="Best deal of the month"
                                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-900/70 to-transparent" />

                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white">
                                        <p className="text-[8px] font-bold uppercase tracking-widest text-green-400">
                                            Best Deal
                                        </p>

                                        <h2 className="mt-1 text-lg font-bold leading-tight">
                                            Special Products<br />
                                            Deal of the Month
                                        </h2>

                                        <button
                                            onClick={() => navigate("/products")}
                                            className="mt-2 text-[9px] font-bold text-green-400 transition hover:text-green-300"
                                        >
                                            Shop Now →
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>
                    <section
                        aria-label="Store features"
                        className="grid grid-cols-2 gap-4 rounded-2xl border border-green-100 bg-white px-6 py-5 shadow-sm lg:grid-cols-4"
                    >
                        {FEATURES.map((f) => (
                            <div key={f.title} className="flex items-center gap-3">
                                <span className="text-2xl flex-shrink-0">{f.icon}</span>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900">{f.title}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* ── Popular Categories ─────────────────────────────────── */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Popular Categories</h2>
                            <Link
                                to="/category"
                                className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                            >
                                View All <span className="text-base">→</span>
                            </Link>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton key={i} className="h-[190px]" />
                                ))}
                            </div>
                        ) : popularCategories.length === 0 ? (
                            <p className="text-gray-400 text-sm">No categories available.</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                                {popularCategories.map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => navigate(`/category/${cat._id}`)}
                                        className="group flex flex-col items-center gap-3 overflow-hidden rounded-xl border-2 border-gray-100 bg-white p-4 transition-all duration-200 hover:border-green-400 hover:shadow-md cursor-pointer"
                                    >
                                        <div className="h-[110px] w-full flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                                            <img
                                                src={cat.image}
                                                alt={cat.name}
                                                className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                                                onError={(e) => { e.target.style.display = "none"; }}
                                            />
                                        </div>
                                        <h3 className="text-center text-sm font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                                            {cat.name}
                                        </h3>
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* ── Popular Products ───────────────────────────────────── */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Popular Products</h2>
                            <Link
                                to="/products"
                                className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                            >
                                View All <span className="text-base">→</span>
                            </Link>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton key={i} className="h-[220px]" />
                                ))}
                            </div>
                        ) : popularProducts.length === 0 ? (
                            <p className="text-gray-400 text-sm">No popular products found.</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                                {popularProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} variant="compact" />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* ── Featured Products ─────────────────────────────────── */}
                    {!loading && featuredProducts.length > 0 && (
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
                                <Link
                                    to="/products"
                                    className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                                >
                                    View All <span className="text-base">→</span>
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                                {featuredProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} variant="compact" />
                                ))}
                            </div>
                        </section>
                    )}

                </div>
            </main>

            {/* ── Footer ────────────────────────────────────────────────────── */}
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

export default Home;
