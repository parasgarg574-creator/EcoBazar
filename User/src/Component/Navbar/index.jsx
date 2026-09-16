import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    FiSearch,
    FiShoppingBag,
    FiMenu,
    FiX,
    FiUser,
    FiChevronDown,
    FiHeart,
    FiMapPin,
    FiNavigation,
    FiRefreshCw,
    FiCheck,
} from "react-icons/fi";
import apimethods from "../../Methods/ApiClient";
import { useShop } from "../../Context/ShopContext";
import { useAuth } from "../../Context/AuthContext";
import CartDrawer from "../CartDrawer";

const LOCATION_STORAGE_KEY = "ecobazar_user_location";

const Navbar = () => {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState([]);
    const [showCategories, setShowCategories] = useState(false);
    const categoryDropdownRef = useRef(null);
    const navigate = useNavigate();

    const { wishlistCount, cartCount, openCart, setToastMessage } = useShop();
    const { user, isLoggedIn, firstLetter } = useAuth();

    // ── Location State & Fetching ───────────────────────────────────────────
    const [userLocation, setUserLocation] = useState(() => {
        try {
            return localStorage.getItem(LOCATION_STORAGE_KEY) || "Lincoln- 344, Illinois, Chicago, USA";
        } catch {
            return "Lincoln- 344, Illinois, Chicago, USA";
        }
    });
    const [locationLoading, setLocationLoading] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [customLocationInput, setCustomLocationInput] = useState("");
    const [locationStatus, setLocationStatus] = useState("");

    // Function to fetch current location via browser Geolocation + Reverse Geocoding
    const detectUserLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus("Geolocation is not supported by your browser.");
            return;
        }

        setLocationLoading(true);
        setLocationStatus("Detecting your location...");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );
                    const data = await res.json();

                    const city = data.city || data.locality || data.principalSubdivision || "";
                    const state = data.principalSubdivision || "";
                    const country = data.countryName || "";

                    const formattedLocation = [city, state, country].filter(Boolean).join(", ");
                    const finalLoc = formattedLocation || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;

                    setUserLocation(finalLoc);
                    localStorage.setItem(LOCATION_STORAGE_KEY, finalLoc);
                    setLocationStatus("Location updated successfully!");
                    setToastMessage?.(`Location set to: ${finalLoc} 📍`);
                    setTimeout(() => setShowLocationModal(false), 800);
                } catch {
                    // Fallback using OpenStreetMap Nominatim
                    try {
                        const osmRes = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        const osmData = await osmRes.json();
                        const address = osmData.address || {};
                        const city = address.city || address.town || address.village || address.county || "";
                        const state = address.state || "";
                        const country = address.country || "";
                        const finalLoc = [city, state, country].filter(Boolean).join(", ") || "Current Location";

                        setUserLocation(finalLoc);
                        localStorage.setItem(LOCATION_STORAGE_KEY, finalLoc);
                        setLocationStatus("Location updated successfully!");
                        setToastMessage?.(`Location set to: ${finalLoc} 📍`);
                        setTimeout(() => setShowLocationModal(false), 800);
                    } catch {
                        const fallback = `Coordinates (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
                        setUserLocation(fallback);
                        localStorage.setItem(LOCATION_STORAGE_KEY, fallback);
                        setLocationStatus("Location detected.");
                        setTimeout(() => setShowLocationModal(false), 800);
                    }
                } finally {
                    setLocationLoading(false);
                }
            },
            (error) => {
                setLocationLoading(false);
                if (error.code === error.PERMISSION_DENIED) {
                    setLocationStatus("Location access was denied. You can enter your location manually below.");
                } else {
                    setLocationStatus("Unable to retrieve location. Please type your city/address.");
                }
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    };

    // Auto-detect location on initial load if not previously set
    useEffect(() => {
        const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
        if (!saved && navigator.geolocation) {
            detectUserLocation();
        }
    }, []);

    const handleSaveCustomLocation = (e) => {
        e.preventDefault();
        if (customLocationInput.trim()) {
            const loc = customLocationInput.trim();
            setUserLocation(loc);
            localStorage.setItem(LOCATION_STORAGE_KEY, loc);
            setCustomLocationInput("");
            setShowLocationModal(false);
            setToastMessage?.(`Location set to: ${loc} 📍`);
        }
    };

    // Fetch categories for dropdown
    useEffect(() => {
        apimethods.getApi("/getcategory")
            .then((res) => setCategories(res.data.data || []))
            .catch(() => setCategories([]));
    }, []);

    // Close category dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
                setShowCategories(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setMobileMenu(false);
        }
    };

    const navLinkClass = ({ isActive }) =>
        `flex h-full items-center text-sm font-medium transition-colors ${
            isActive ? "text-green-400" : "text-gray-300 hover:text-white"
        }`;

    const mobileNavLinkClass = ({ isActive }) =>
        `block py-3 border-b border-gray-100 text-sm font-medium transition-colors ${
            isActive ? "text-green-600" : "text-gray-700 hover:text-green-600"
        }`;

    return (
        <>
            <header className="w-full bg-white sticky top-0 z-50 shadow-sm">
                {/* ── Top Bar with Location Section ──────────────────────── */}
                <div className="border-b border-gray-100 bg-[#F7F8F9] text-xs text-[#666666]">
                    <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8 py-2">
                        {/* Location Section */}
                        <div
                            onClick={() => setShowLocationModal(true)}
                            className="flex items-center gap-2 cursor-pointer group hover:text-[#00B207] transition-colors"
                            title="Click to change your location"
                        >
                            <FiMapPin className="text-[#00B207] shrink-0 group-hover:scale-110 transition-transform" size={14} />
                            <span className="text-[#808080] hidden xs:inline">Store Location:</span>
                            <span className="font-medium text-[#1A1A1A] group-hover:text-[#00B207] transition-colors truncate max-w-[200px] sm:max-w-[320px] md:max-w-md">
                                {locationLoading ? "Detecting location..." : userLocation}
                            </span>
                            {/* <span className="text-[10px] bg-green-100 text-[#00B207] px-1.5 py-0.5 rounded font-semibold hidden md:inline-block">
                                Change
                            </span> */}
                        </div>

                        {/* Topbar Right Links */}
                        <div className="flex items-center gap-4 text-xs text-[#666666]">
                            {/* <span className="hidden sm:inline text-[#808080]">
                                Free shipping on all orders over <strong className="text-[#1A1A1A]">$50</strong>
                            </span> */}
                            <span className="text-gray-300 hidden sm:inline">|</span>
                            {isLoggedIn ? (
                                <Link to="/account" className="font-medium text-[#1A1A1A] hover:text-[#00B207] transition-colors">
                                    Hi, {user?.name?.split(" ")[0]}
                                </Link>
                            ) : (
                                <div className="flex items-center gap-1.5 font-medium">
                                    <Link to="/signin" className="text-[#1A1A1A] hover:text-[#00B207] transition-colors">
                                        Sign In
                                    </Link>
                                    <span className="text-gray-300">/</span>
                                    <Link to="/signup" className="text-[#1A1A1A] hover:text-[#00B207] transition-colors">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main bar */}
                <div className="border-b border-gray-100">
                    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                        <div className="flex min-h-[68px] items-center justify-between gap-4 py-3">

                            {/* Logo */}
                            <Link to="/" className="flex shrink-0 items-center gap-2">
                                <img
                                    src="/Logo (1).png"
                                    alt="EcoBazar logo"
                                    className="h-9 w-auto object-contain"
                                />
                            </Link>

                            {/* Desktop search bar */}
                            <form
                                onSubmit={handleSearch}
                                className="hidden flex-1 sm:flex max-w-[500px]"
                            >
                                <div className="flex h-10 w-full overflow-hidden rounded-lg border border-gray-200 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-200 transition-all">
                                    <div className="flex flex-1 items-center gap-2 px-3">
                                        <FiSearch size={17} className="shrink-0 text-gray-400" />
                                        <input
                                            type="text"
                                            id="navbar-search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search products..."
                                            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400 text-gray-800"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-4 bg-green-600 text-sm font-semibold text-white transition hover:bg-green-700 shrink-0"
                                    >
                                        Search
                                    </button>
                                </div>
                            </form>

                            {/* Desktop right icons */}
                            <div className="hidden items-center gap-5 sm:flex">
                                {/* Wishlist */}
                                <Link
                                    to="/wishlist"
                                    aria-label="Wishlist"
                                    className="relative text-gray-600 hover:text-red-500 transition-colors flex items-center gap-1.5"
                                >
                                    <div className="relative">
                                        <FiHeart size={22} strokeWidth={1.5} className={wishlistCount > 0 ? "text-red-500 fill-red-50" : ""} />
                                        {wishlistCount > 0 && (
                                            <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
                                                {wishlistCount}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs font-medium hidden lg:block">Wishlist</span>
                                </Link>

                                {/* Cart */}
                                <button
                                    type="button"
                                    onClick={openCart}
                                    aria-label="Shopping cart"
                                    className="relative text-gray-600 hover:text-green-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                                >
                                    <div className="relative">
                                        <FiShoppingBag size={24} strokeWidth={1.5} />
                                        {cartCount > 0 && (
                                            <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-bold text-white shadow-sm">
                                                {cartCount}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs font-medium hidden lg:block">Cart</span>
                                </button>

                                {/* User / Account */}
                                {/* {isLoggedIn ? (
                                    <Link
                                        to="/account"
                                        className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors group"
                                        title={`Signed in as ${user?.name}`}
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-green-600 to-emerald-500 text-xs font-extrabold text-white shadow-sm ring-2 ring-green-100 group-hover:scale-105 transition-transform">
                                            {firstLetter || "U"}
                                        </div>
                                        <span className="text-xs font-semibold hidden lg:block max-w-[110px] truncate">
                                            {user?.name?.split(" ")[0] || "Account"}
                                        </span>
                                    </Link>
                                ) : (
                                    <Link
                                        to="/account"
                                        className="flex items-center gap-1.5 text-gray-600 hover:text-green-600 transition-colors"
                                    >
                                        <FiUser size={22} strokeWidth={1.5} />
                                        <span className="text-xs font-medium hidden lg:block">Account</span>
                                    </Link>
                                )} */}
                            </div>

                            {/* Mobile right controls */}
                            <div className="flex items-center gap-3 sm:hidden">
                                <Link
                                    to="/wishlist"
                                    aria-label="Wishlist"
                                    className="relative text-gray-700 hover:text-red-500 transition-colors"
                                >
                                    <FiHeart size={21} className={wishlistCount > 0 ? "text-red-500 fill-red-50" : ""} />
                                    {wishlistCount > 0 && (
                                        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </Link>

                                <button
                                    type="button"
                                    aria-label="Shopping cart"
                                    onClick={openCart}
                                    className="relative text-gray-700 hover:text-green-600 transition-colors cursor-pointer"
                                >
                                    <FiShoppingBag size={22} />
                                    {cartCount > 0 && (
                                        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-600 px-1 text-[9px] font-bold text-white">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>

                                {isLoggedIn ? (
                                    <Link
                                        to="/account"
                                        aria-label="Account profile"
                                        className="flex items-center justify-center"
                                    >
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-green-600 to-emerald-500 text-xs font-extrabold text-white shadow-sm ring-1 ring-green-200">
                                            {firstLetter || "U"}
                                        </div>
                                    </Link>
                                ) : (
                                    <Link
                                        to="/account"
                                        aria-label="Sign in"
                                        className="text-gray-700 hover:text-green-600 transition-colors"
                                    >
                                        <FiUser size={22} />
                                    </Link>
                                )}

                                <button
                                    type="button"
                                    aria-label={mobileMenu ? "Close menu" : "Open menu"}
                                    onClick={() => setMobileMenu(!mobileMenu)}
                                    className="text-gray-700 hover:text-green-600 transition-colors"
                                >
                                    {mobileMenu ? <FiX size={24} /> : <FiMenu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation bar */}
                <nav className="hidden h-11 bg-gray-800 sm:block">
                    <div className="mx-auto flex h-full max-w-[1400px] items-center gap-6 px-4 sm:px-6 lg:px-8">
                        {/* Categories dropdown */}
                        <div ref={categoryDropdownRef} className="relative h-full flex items-center">
                            <button
                                onClick={() => setShowCategories(!showCategories)}
                                className="flex h-full items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
                            >
                                Categories
                                <FiChevronDown
                                    size={14}
                                    className={`transition-transform ${showCategories ? "rotate-180" : ""}`}
                                />
                            </button>

                            {showCategories && categories.length > 0 && (
                                <div className="absolute top-full left-0 z-50 mt-px w-56 rounded-b-xl bg-white shadow-xl border border-gray-100 py-2">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat._id}
                                            to={`/category/${cat._id}`}
                                            onClick={() => setShowCategories(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                                        >
                                            {cat.image && (
                                                <img src={cat.image} alt={cat.name} className="w-6 h-6 object-contain rounded" />
                                            )}
                                            {cat.name}
                                        </Link>
                                    ))}
                                    <div className="border-t border-gray-100 mt-1 pt-1 flex flex-col">
                                        <Link
                                            to="/category"
                                            onClick={() => setShowCategories(false)}
                                            className="flex items-center px-4 py-2 text-sm font-semibold text-green-600 hover:bg-green-50 transition-colors"
                                        >
                                            All Categories →
                                        </Link>
                                        <Link
                                            to="/products"
                                            onClick={() => setShowCategories(false)}
                                            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                        >
                                            View All Products →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <NavLink to="/" className={navLinkClass} end>Home</NavLink>
                        <NavLink to="/category" className={navLinkClass}>Categories</NavLink>
                        <NavLink to="/products" className={navLinkClass}>Shop</NavLink>
                        <NavLink to="/wishlist" className={navLinkClass}>Wishlist</NavLink>
                        <NavLink to="/cart" className={navLinkClass}>Cart</NavLink>

                        <div className="ml-auto" />

                        {isLoggedIn ? (
                            <Link
                                to="/account"
                                className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">
                                    {firstLetter || "U"}
                                </div>
                                <span className="max-w-[120px] truncate">{user?.name?.split(" ")[0]}</span>
                            </Link>
                        ) : (
                            <Link
                                to="/account"
                                className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                <FiUser size={15} />
                                My Account
                            </Link>
                        )}
                    </div>
                </nav>

                {/* Mobile menu panel */}
                {mobileMenu && (
                    <div className="border-b border-gray-200 bg-white sm:hidden shadow-lg">
                        {/* Mobile search */}
                        <form onSubmit={handleSearch} className="px-4 pt-4 pb-3">
                            <div className="flex h-10 w-full overflow-hidden rounded-lg border border-gray-200 focus-within:border-green-500 transition-all">
                                <div className="flex flex-1 items-center gap-2 px-3">
                                    <FiSearch size={16} className="shrink-0 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products..."
                                        className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-4 bg-green-600 text-sm font-semibold text-white"
                                >
                                    Go
                                </button>
                            </div>
                        </form>

                        <nav className="mx-4 flex flex-col pb-4">
                            <NavLink to="/" onClick={() => setMobileMenu(false)} className={mobileNavLinkClass} end>
                                Home
                            </NavLink>
                            <NavLink to="/category" onClick={() => setMobileMenu(false)} className={mobileNavLinkClass}>
                                Categories
                            </NavLink>
                            <NavLink to="/products" onClick={() => setMobileMenu(false)} className={mobileNavLinkClass}>
                                Shop
                            </NavLink>
                            <NavLink to="/wishlist" onClick={() => setMobileMenu(false)} className={mobileNavLinkClass}>
                                Wishlist ({wishlistCount})
                            </NavLink>
                            <NavLink to="/cart" onClick={() => setMobileMenu(false)} className={mobileNavLinkClass}>
                                Shopping Cart ({cartCount})
                            </NavLink>

                            {/* Mobile categories */}
                            {categories.length > 0 && (
                                <div className="py-3 border-b border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Categories
                                        </p>
                                        <Link
                                            to="/category"
                                            onClick={() => setMobileMenu(false)}
                                            className="text-xs font-semibold text-green-600 hover:text-green-700"
                                        >
                                            View All →
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1">
                                        {categories.slice(0, 6).map((cat) => (
                                            <Link
                                                key={cat._id}
                                                to={`/category/${cat._id}`}
                                                onClick={() => setMobileMenu(false)}
                                                className="flex items-center gap-1.5 py-1.5 text-sm text-gray-700 hover:text-green-600 transition-colors"
                                            >
                                                {cat.image && (
                                                    <img src={cat.image} alt="" className="w-5 h-5 object-contain rounded" />
                                                )}
                                                <span className="truncate">{cat.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Mobile Location */}
                            <div
                                onClick={() => {
                                    setMobileMenu(false);
                                    setShowLocationModal(true);
                                }}
                                className="flex items-center justify-between py-3 border-b border-gray-100 text-sm text-gray-700 cursor-pointer hover:text-green-600 transition"
                            >
                                <div className="flex items-center gap-2 truncate">
                                    <FiMapPin className="text-[#00B207] shrink-0" size={16} />
                                    <span className="truncate">{userLocation}</span>
                                </div>
                                <span className="text-xs text-[#00B207] font-semibold shrink-0">Change</span>
                            </div>

                            {/* Mobile User Profile Link */}
                            <Link
                                to="/account"
                                onClick={() => setMobileMenu(false)}
                                className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                            >
                                {isLoggedIn ? (
                                    <>
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white shadow-sm">
                                            {firstLetter || "U"}
                                        </div>
                                        <span className="font-semibold text-gray-800">{user?.name} (Account)</span>
                                    </>
                                ) : (
                                    <>
                                        <FiUser size={18} />
                                        <span>Sign In / Register</span>
                                    </>
                                )}
                            </Link>
                        </nav>
                    </div>
                )}
            </header>

            {/* ── Location Modal ───────────────────────────────────────── */}
            {showLocationModal && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#F7F8F9]">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-[#00B207] flex items-center justify-center">
                                    <FiMapPin size={16} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">Choose your location</h3>
                                    <p className="text-xs text-gray-500">Delivery options and products vary by location</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowLocationModal(false)}
                                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">
                            {/* Current Location Badge */}
                            <div className="p-3.5 bg-green-50/70 border border-green-200 rounded-xl flex items-start gap-3">
                                <FiMapPin className="text-[#00B207] shrink-0 mt-0.5" size={16} />
                                <div className="min-w-0">
                                    <span className="text-xs font-semibold text-[#00B207] block uppercase tracking-wider">Current Location</span>
                                    <p className="text-sm font-medium text-gray-800 truncate">{userLocation}</p>
                                </div>
                            </div>

                            {/* GPS Detect Button */}
                            <button
                                type="button"
                                onClick={detectUserLocation}
                                disabled={locationLoading}
                                className="w-full py-3 px-4 bg-white border-2 border-[#00B207] text-[#00B207] hover:bg-green-50 font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
                            >
                                {locationLoading ? (
                                    <>
                                        <div className="w-4 h-4 rounded-full border-2 border-[#00B207] border-t-transparent animate-spin" />
                                        <span>Detecting GPS Location...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiNavigation size={16} />
                                        <span>Detect My Current Location</span>
                                    </>
                                )}
                            </button>

                            {locationStatus && (
                                <p className="text-xs text-center text-gray-500">{locationStatus}</p>
                            )}

                            {/* Divider */}
                            <div className="relative flex items-center justify-center">
                                <div className="border-t border-gray-200 w-full" />
                                <span className="bg-white px-3 text-xs text-gray-400 uppercase font-medium">Or enter manually</span>
                            </div>

                            {/* Manual Entry Form */}
                            <form onSubmit={handleSaveCustomLocation} className="space-y-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={customLocationInput}
                                        onChange={(e) => setCustomLocationInput(e.target.value)}
                                        placeholder="e.g. Chicago, New York, London, New Delhi"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207] transition"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={!customLocationInput.trim()}
                                    className="w-full py-3 bg-[#00B207] hover:bg-[#009e06] text-white font-semibold text-sm rounded-xl transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    Save Location
                                </button>
                            </form>

                            {/* Popular Presets */}
                            <div>
                                <span className="text-xs font-semibold text-gray-400 block mb-2">Popular Cities:</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {[
                                        "Chicago, USA",
                                        "New York, USA",
                                        "London, UK",
                                        "Toronto, Canada",
                                        "New Delhi, India",
                                        "Mumbai, India",
                                    ].map((city) => (
                                        <button
                                            key={city}
                                            type="button"
                                            onClick={() => {
                                                setUserLocation(city);
                                                localStorage.setItem(LOCATION_STORAGE_KEY, city);
                                                setShowLocationModal(false);
                                                setToastMessage?.(`Location set to: ${city} 📍`);
                                            }}
                                            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-green-100 hover:text-[#00B207] text-gray-700 rounded-lg transition"
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Slide-over Cart Drawer */}
            <CartDrawer />
        </>
    );
};

export default Navbar;
