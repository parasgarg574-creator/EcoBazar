import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    FiSearch,
    FiShoppingBag,
    FiMenu,
    FiX,
    FiUser,
    FiChevronDown,
} from "react-icons/fi";
import apimethods from "../../Methods/ApiClient";

const Navbar = () => {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState([]);
    const [showCategories, setShowCategories] = useState(false);
    const categoryDropdownRef = useRef(null);
    const navigate = useNavigate();

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
        <header className="w-full bg-white sticky top-0 z-50 shadow-sm">
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
                            {/* User */}
                            <Link
                                to="/account"
                                className="flex items-center gap-1.5 text-gray-600 hover:text-green-600 transition-colors"
                            >
                                <FiUser size={22} strokeWidth={1.5} />
                                <span className="text-xs font-medium hidden lg:block">Account</span>
                            </Link>

                            {/* Cart */}
                            <button
                                type="button"
                                aria-label="Shopping cart"
                                className="relative text-gray-600 hover:text-green-600 transition-colors flex items-center gap-1.5"
                            >
                                <div className="relative">
                                    <FiShoppingBag size={24} strokeWidth={1.5} />
                                    <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-bold text-white">
                                        0
                                    </span>
                                </div>
                                <span className="text-xs font-medium hidden lg:block">Cart</span>
                            </button>
                        </div>

                        {/* Mobile right controls */}
                        <div className="flex items-center gap-3 sm:hidden">
                            <button
                                type="button"
                                aria-label="Search"
                                onClick={() => setMobileMenu(!mobileMenu)}
                                className="text-gray-700 hover:text-green-600 transition-colors"
                            >
                                <FiSearch size={22} />
                            </button>
                            <button
                                type="button"
                                aria-label="Shopping cart"
                                className="relative text-gray-700 hover:text-green-600 transition-colors"
                            >
                                <FiShoppingBag size={23} />
                                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-600 px-1 text-[9px] font-bold text-white">
                                    0
                                </span>
                            </button>
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
                            className="flex h-full items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors"
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
                                <div className="border-t border-gray-100 mt-1 pt-1">
                                    <Link
                                        to="/products"
                                        onClick={() => setShowCategories(false)}
                                        className="flex items-center px-4 py-2.5 text-sm font-semibold text-green-600 hover:bg-green-50 transition-colors"
                                    >
                                        View All Products →
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <NavLink to="/" className={navLinkClass} end>Home</NavLink>
                    <NavLink to="/products" className={navLinkClass}>Shop</NavLink>

                    <div className="ml-auto" />

                    <Link
                        to="/account"
                        className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                    >
                        <FiUser size={15} />
                        My Account
                    </Link>
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
                        <NavLink to="/products" onClick={() => setMobileMenu(false)} className={mobileNavLinkClass}>
                            Shop
                        </NavLink>

                        {/* Mobile categories */}
                        {categories.length > 0 && (
                            <div className="py-3 border-b border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                    Categories
                                </p>
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

                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
                            <FiUser size={16} />
                            <span>My Account</span>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;
