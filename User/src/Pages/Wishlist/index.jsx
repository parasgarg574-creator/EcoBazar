import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../Component/Navbar";
import Breadcrumb from "../../Component/Breadcrumb";
import { useShop } from "../../Context/ShopContext";
import { FiX, FiHeart, FiArrowRight } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaPinterestP, FaInstagram } from "react-icons/fa";

const FALLBACK_IMAGE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

const Wishlist = () => {
    const {
        wishlist,
        wishlistCount,
        removeFromWishlist,
        addToCart,
    } = useShop();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-[#F7F8F9]">
            {/* Dynamic Navbar */}
            <Navbar />

            {/* Dynamic Breadcrumb */}
            <Breadcrumb labels={{ wishlist: "Wishlist" }} />

            <main className="flex-1 w-full py-10 sm:py-12">
                <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
                    {/* Page Heading */}
                    <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#1A1A1A] text-center mb-8">
                        My Wishlist
                    </h1>

                    {/* Empty State */}
                    {wishlistCount === 0 ? (
                        <div className="bg-white rounded-xl border border-[#E6E6E6] p-12 sm:p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)] max-w-lg mx-auto">
                            <div className="w-16 h-16 rounded-full bg-red-50 text-red-400 flex items-center justify-center mx-auto mb-4">
                                <FiHeart size={28} />
                            </div>
                            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                                Your Wishlist is Empty
                            </h2>
                            <p className="text-sm text-[#666666] mb-6">
                                Explore our store to find healthy, fresh groceries and add your favorites here.
                            </p>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#00B207] hover:bg-[#009e06] text-white text-sm font-semibold rounded-full transition shadow-sm"
                            >
                                <span>Return to Shop</span>
                                <FiArrowRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        /* Wishlist Table Card */
                        <div className="bg-white rounded-xl border border-[#E6E6E6] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[700px]">
                                    <thead>
                                        <tr className="border-b border-[#E6E6E6] text-xs font-semibold uppercase text-[#808080] tracking-wider">
                                            <th className="py-4 px-6 sm:px-8 w-[40%]">Product</th>
                                            <th className="py-4 px-6 w-[20%]">Price</th>
                                            <th className="py-4 px-6 w-[20%]">Stock Status</th>
                                            <th className="py-4 px-6 sm:px-8 text-right w-[20%]"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E6E6E6]">
                                        {wishlist.map((product) => {
                                            const price = Number(product.price) || 0;
                                            const discount = Number(product.discount) || 0;
                                            const originalPrice =
                                                discount > 0
                                                    ? (price / (1 - discount / 100)).toFixed(2)
                                                    : null;
                                            const isInStock =
                                                product.stock !== undefined
                                                    ? Number(product.stock) > 0
                                                    : true;

                                            return (
                                                <tr
                                                    key={product._id}
                                                    className="hover:bg-gray-50/50 transition-colors"
                                                >
                                                    {/* Product Thumbnail & Name */}
                                                    <td className="py-4 px-6 sm:px-8">
                                                        <div className="flex items-center gap-4">
                                                            <div
                                                                onClick={() =>
                                                                    navigate(`/products/${product._id}`)
                                                                }
                                                                className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-lg bg-gray-50 p-2 cursor-pointer border border-[#F2F2F2] flex items-center justify-center"
                                                            >
                                                                <img
                                                                    src={product.image || FALLBACK_IMAGE}
                                                                    alt={product.name}
                                                                    className="h-full w-full object-contain hover:scale-105 transition-transform"
                                                                    onError={(e) => {
                                                                        e.target.src = FALLBACK_IMAGE;
                                                                    }}
                                                                />
                                                            </div>
                                                            <Link
                                                                to={`/products/${product._id}`}
                                                                className="text-sm sm:text-base font-medium text-[#1A1A1A] hover:text-[#00B207] transition line-clamp-2"
                                                            >
                                                                {product.name}
                                                            </Link>
                                                        </div>
                                                    </td>

                                                    {/* Price */}
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                                                                ${price.toFixed(2)}
                                                            </span>
                                                            {originalPrice && (
                                                                <span className="text-xs sm:text-sm text-[#999999] line-through">
                                                                    ${originalPrice}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Stock Status */}
                                                    <td className="py-4 px-6">
                                                        {isInStock ? (
                                                            <span className="inline-block px-2.5 py-1 rounded bg-[#20B526]/10 text-[#2C742F] text-xs font-medium">
                                                                In Stock
                                                            </span>
                                                        ) : (
                                                            <span className="inline-block px-2.5 py-1 rounded bg-[#EA4B48]/10 text-[#EA4B48] text-xs font-medium">
                                                                Out of Stock
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Actions (Add to Cart & Remove) */}
                                                    <td className="py-4 px-6 sm:px-8 text-right">
                                                        <div className="flex items-center justify-end gap-3 sm:gap-4">
                                                            {isInStock ? (
                                                                <button
                                                                    onClick={() =>
                                                                        addToCart(product, 1, true)
                                                                    }
                                                                    className="px-5 sm:px-6 py-2.5 bg-[#00B207] hover:bg-[#009e06] text-white text-xs sm:text-sm font-semibold rounded-full transition shadow-sm cursor-pointer whitespace-nowrap"
                                                                >
                                                                    Add to Cart
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    disabled
                                                                    className="px-5 sm:px-6 py-2.5 bg-[#F2F2F2] text-[#B3B3B3] text-xs sm:text-sm font-semibold rounded-full cursor-not-allowed whitespace-nowrap"
                                                                >
                                                                    Add to Cart
                                                                </button>
                                                            )}

                                                            <button
                                                                onClick={() =>
                                                                    removeFromWishlist(product._id)
                                                                }
                                                                className="w-7 h-7 rounded-full border border-[#CCCCCC] flex items-center justify-center text-[#808080] hover:text-[#EA4B48] hover:border-[#EA4B48] transition-colors cursor-pointer shrink-0"
                                                                aria-label="Remove item"
                                                                title="Remove"
                                                            >
                                                                <FiX size={13} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Share Section in Footer */}
                            <div className="border-t border-[#E6E6E6] px-6 sm:px-8 py-4 flex items-center gap-3 bg-white">
                                <span className="text-sm font-normal text-[#1A1A1A]">Share:</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            window.open(
                                                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                                    window.location.href
                                                )}`,
                                                "_blank"
                                            )
                                        }
                                        className="w-8 h-8 rounded-full bg-[#00B207] text-white flex items-center justify-center hover:bg-[#009e06] transition shadow-sm cursor-pointer"
                                        aria-label="Share on Facebook"
                                    >
                                        <FaFacebookF size={12} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            window.open(
                                                `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                                                    window.location.href
                                                )}&text=Check out my wishlist on EcoBazar!`,
                                                "_blank"
                                            )
                                        }
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#4D4D4D] hover:text-[#00B207] transition cursor-pointer"
                                        aria-label="Share on Twitter"
                                    >
                                        <FaTwitter size={15} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            window.open(
                                                `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
                                                    window.location.href
                                                )}`,
                                                "_blank"
                                            )
                                        }
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#4D4D4D] hover:text-[#00B207] transition cursor-pointer"
                                        aria-label="Share on Pinterest"
                                    >
                                        <FaPinterestP size={15} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            window.open(
                                                "https://instagram.com",
                                                "_blank"
                                            )
                                        }
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#4D4D4D] hover:text-[#00B207] transition cursor-pointer"
                                        aria-label="Share on Instagram"
                                    >
                                        <FaInstagram size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Wishlist;
