import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Component/Navbar";
const Home = () => {
    const [popularCategories, setPopularCategories] = useState([]);
    const [popularproducts, setPopularProducts] = useState([]);
    const [Featuredproducts, setFeatuedproducts] = useState([]);

    const navigation = useNavigate();

    const getcategory = async () => {
        try {
            const response = await fetch("http://localhost:5000/getcategory", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            const popularCategories = data.data.filter(
                (item) => item.ispopular === true
            );

            setPopularCategories(popularCategories);
        } catch (er) {
            console.log(er);
        }
    };

    const getpopularproducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/all", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            const popularProducts = data.data.filter(
                (item) => item.ispopular === true
            );

            const featuredProduct = data.data.filter(
                (item) => item.isfeatured === true
            );

            setPopularProducts(popularProducts);
            setFeatuedproducts(featuredProduct);

            console.log("Popular Products:", popularProducts);
            console.log("featured:", featuredProduct);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getcategory();
        getpopularproducts();
    }, []);

    return (
        <>
            <Navbar />
            <section className="w-full px-2 py-4 sm:px-4 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1400px]">
                    <div className="mb-10 grid h-auto grid-cols-1 gap-1.5 overflow-hidden rounded-md md:h-[430px] md:grid-cols-[2fr_1fr] md:grid-rows-2">
                        <div className="group relative min-h-[400px] overflow-hidden rounded-md md:row-span-2">
                            <img
                                src="/banner-main.jpg"
                                alt="Fresh and healthy organic food"
                                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-800/70 to-transparent" />
                            <div className="absolute left-6 top-1/2 max-w-[430px] -translate-y-1/2 text-white sm:left-8 md:left-10">
                                <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
                                    Fresh &amp; Healthy
                                    <br />
                                    Organic Food
                                </h1>

                                <div className="mt-5 flex max-w-[280px] items-center gap-2 border-t border-white/40 pt-3">
                                    <span className="text-sm">
                                        Sale up to
                                    </span>
                                    <span className="rounded bg-orange-500 px-2 py-1 text-xs font-bold">
                                        30% OFF
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-white/80">
                                    Free shipping on all your order
                                </p>
                                <button
                                    onClick={() => navigation("/products")}
                                    className="mt-4 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-green-600 transition hover:bg-green-500 hover:text-white"
                                >
                                    Shop now
                                    <span className="ml-2">→</span>
                                </button>
                            </div>
                        </div>
                        <div className="group relative min-h-[220px] overflow-hidden rounded-md">
                            <img
                                src="/banner-sale.jpg"
                                alt="Fresh vegetables"
                                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-transparent" />
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 sm:left-7">
                                <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-600">
                                    Summer Sale
                                </p>

                                <h2 className="mt-1 text-3xl font-extrabold leading-none text-gray-900">
                                    75% OFF
                                </h2>
                                <p className="mt-2 text-[10px] text-gray-500">
                                    Only Fruits &amp; Vegetable
                                </p>

                                <button
                                    onClick={() => navigation("/products")}
                                    className="mt-3 text-[10px] font-bold text-green-600 transition hover:text-green-800"
                                >
                                    Shop Now
                                    <span className="ml-1">→</span>
                                </button>
                            </div>
                        </div>
                        <div className="group relative min-h-[220px] overflow-hidden rounded-md">
                            <img
                                src="/banner-deal.jpg"
                                alt="Special organic products"
                                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-900/65 to-green-900/20" />
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white sm:left-7">
                                <p className="text-[9px] font-semibold uppercase tracking-wide text-white/80">
                                    Best Deal
                                </p>
                                <h2 className="mt-1 text-2xl font-extrabold leading-tight sm:text-3xl">
                                    Special Products
                                    <br />
                                    Deal of the Month
                                </h2>
                                <button
                                    onClick={() => navigation("/products")}
                                    className="mt-3 text-[10px] font-bold text-green-400 transition hover:text-green-300"
                                >
                                    Shop Now
                                    <span className="ml-1">→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mb-10 grid grid-cols-1 gap-5 rounded-md border border-green-500 bg-white px-5 py-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl text-green-500">🚚</span>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Free Shipping
                                </h3>
                                <p className="text-xs text-gray-400">
                                    Free shipping on all your order
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl text-green-500">♧</span>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Customer Support 24/7
                                </h3>
                                <p className="text-xs text-gray-400">
                                    Instant access to Support
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl text-green-500">♧</span>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">
                                    100% Secure Payment
                                </h3>
                                <p className="text-xs text-gray-400">
                                    We ensure your money is safe
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl text-green-500">◇</span>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Money-Back Guarantee
                                </h3>
                                <p className="text-xs text-gray-400">
                                    30 Days Money-Back Guarantee
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
                            Popular Categories
                        </h2>

                        <button
                            onClick={() => navigation("/categories")}
                            className="flex items-center gap-1 text-sm font-semibold text-green-500 transition hover:text-green-400 sm:text-base"
                        >
                            View All
                            <span className="text-xl leading-none">→</span>
                        </button>
                    </div>
                    <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-6">
                        {popularCategories.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => {
                                    navigation(`/category/${item._id}`);
                                }}
                                className="group flex h-[210px] cursor-pointer flex-col items-center justify-between overflow-hidden rounded-md border-2 border-gray-200 bg-white px-3 py-4 transition-all duration-200 hover:border-green-500 sm:h-[215px]"
                            >
                                <div className="flex h-[155px] w-full items-center justify-center">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105"
                                    />
                                </div>

                                <h3 className="text-center text-base font-medium text-gray-900 sm:text-lg">
                                    {item.name}
                                </h3>
                            </div>
                        ))}
                    </div>
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
                            Popular Products
                        </h2>
                        <button
                            onClick={() => navigation("/products")}
                            className="flex items-center gap-1 text-sm font-semibold text-green-500 transition hover:text-green-400 sm:text-base"
                        >
                            View All
                            <span className="text-xl leading-none">→</span>
                        </button>
                    </div>
                    <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-6">
                        {popularproducts.map((item) => (
                            <div
                                key={item._id}
                                className="group flex h-[230px] cursor-pointer flex-col items-center justify-between overflow-hidden rounded-md border-2 border-gray-200 bg-white px-3 py-4 transition-all duration-200 hover:border-green-500"
                            >
                                <div className="flex h-[155px] w-full items-center justify-center">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="w-full">
                                    <h3 className="truncate text-center text-base font-medium text-gray-900 sm:text-lg">
                                        {item.name}
                                    </h3>

                                    <div className="mt-1 flex items-center justify-between text-xs sm:text-sm">
                                        <span className="font-semibold text-gray-900">
                                            ₹{item.price ?? 0}
                                        </span>

                                        <span className="font-semibold text-orange-500">
                                            {item.discount ?? 0}% OFF
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
                            Featured Products
                        </h2>

                        <button
                            onClick={() => navigation("/products")}
                            className="flex items-center gap-1 text-sm font-semibold text-green-500 transition hover:text-green-400 sm:text-base"
                        >
                            View All
                            <span className="text-xl leading-none">→</span>
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-6">
                        {Featuredproducts.map((item) => (
                            <div
                                key={item._id}
                                className="group flex h-[230px] cursor-pointer flex-col items-center justify-between overflow-hidden rounded-md border-2 border-gray-200 bg-white px-3 py-4 transition-all duration-200 hover:border-green-500"
                            >
                                <div className="flex h-[155px] w-full items-center justify-center">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="w-full">
                                    <h3 className="truncate text-center text-base font-medium text-gray-900 sm:text-lg">
                                        {item.name}
                                    </h3>

                                    <div className="mt-1 flex items-center justify-between text-xs sm:text-sm">
                                        <span className="font-semibold text-gray-900">
                                            ₹{item.price ?? 0}
                                        </span>

                                        <span className="font-semibold text-orange-500">
                                            {item.discount ?? 0}% OFF
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
};
export default Home;
