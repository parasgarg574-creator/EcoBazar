import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiStar, FiHeart } from "react-icons/fi";
import { useShop } from "../../Context/ShopContext";

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

/**
 * Reusable ProductCard component with Wishlist and Cart support.
 *
 * Props:
 *   product: { _id, name, price, discount, stock, image, category }
 *   variant: "default" | "compact" — compact is smaller, used in home page grids
 */
const ProductCard = ({ product, variant = "default" }) => {
    const navigate = useNavigate();
    const { isInWishlist, toggleWishlist, addToCart } = useShop();

    if (!product) return null;

    const {
        _id,
        name = "Unnamed Product",
        price = 0,
        discount = 0,
        stock = 0,
        image,
    } = product;

    const isWishlisted = isInWishlist(_id);
    const isInStock = Number(stock) > 0;
    const discountPercent = Number(discount) || 0;
    const originalPrice = discountPercent > 0
        ? (Number(price) / (1 - discountPercent / 100)).toFixed(2)
        : null;

    const handleClick = () => navigate(`/products/${_id}`);

    const handleWishlistToggle = (e) => {
        e.stopPropagation();
        toggleWishlist(product);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (isInStock) {
            addToCart(product, 1, true);
        }
    };

    const handleImageError = (e) => {
        e.target.src = FALLBACK_IMAGE;
    };

    if (variant === "compact") {
        return (
            <div
                onClick={handleClick}
                className="group relative flex flex-col items-center cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white p-3 transition-all duration-200 hover:border-green-400 hover:shadow-md"
            >
                {/* Discount badge */}
                {discountPercent > 0 && (
                    <span className="absolute top-2 left-2 z-10 rounded-md bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        -{discountPercent}%
                    </span>
                )}

                {/* Wishlist button */}
                <button
                    onClick={handleWishlistToggle}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    className={`absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
                        isWishlisted
                            ? "text-red-500"
                            : "text-gray-400 hover:text-red-500"
                    }`}
                >
                    <FiHeart
                        size={14}
                        className={isWishlisted ? "fill-red-500 text-red-500" : ""}
                    />
                </button>

                {/* Image */}
                <div className="w-full aspect-square flex items-center justify-center overflow-hidden rounded-lg bg-gray-50 mb-2">
                    <img
                        src={image || FALLBACK_IMAGE}
                        alt={name}
                        onError={handleImageError}
                        className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    />
                </div>

                {/* Info */}
                <div className="w-full text-left">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-1">
                        {name}
                    </h3>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">₹{Number(price).toFixed(2)}</span>
                        {originalPrice && (
                            <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>
                        )}
                    </div>
                    {!isInStock && (
                        <span className="text-[10px] text-red-500 font-medium">Out of stock</span>
                    )}
                </div>
            </div>
        );
    }

    // Default (full) variant
    return (
        <div
            onClick={handleClick}
            className="group relative flex flex-col cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-green-400 hover:shadow-lg"
        >
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                {discountPercent > 0 && (
                    <span className="rounded-md bg-orange-500 px-2 py-0.5 text-[11px] font-bold text-white">
                        -{discountPercent}%
                    </span>
                )}
                {!isInStock && (
                    <span className="rounded-md bg-gray-700 px-2 py-0.5 text-[11px] font-bold text-white">
                        Out of Stock
                    </span>
                )}
            </div>

            {/* Wishlist Button */}
            <button
                onClick={handleWishlistToggle}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className={`absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
                    isWishlisted
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-500"
                }`}
            >
                <FiHeart
                    size={16}
                    className={isWishlisted ? "fill-red-500 text-red-500" : ""}
                />
            </button>

            {/* Image */}
            <div className="relative w-full overflow-hidden bg-gray-50" style={{ aspectRatio: "4/3" }}>
                <img
                    src={image || FALLBACK_IMAGE}
                    alt={name}
                    onError={handleImageError}
                    className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 p-4">
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-2 flex-1">
                    {name}
                </h3>

                {/* Stars placeholder */}
                <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <FiStar
                            key={s}
                            size={11}
                            className={s <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                        />
                    ))}
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-gray-900">₹{Number(price).toFixed(2)}</span>
                    {originalPrice && (
                        <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>
                    )}
                </div>

                {/* Add to Cart */}
                <button
                    onClick={handleAddToCart}
                    disabled={!isInStock}
                    className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    <FiShoppingCart size={13} />
                    {isInStock ? "Add to Cart" : "Out of Stock"}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
