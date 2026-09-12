import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Home = () => {
    const [popularCategories, setPopularCategories] = useState([]);
    const [popularproducts, setPopularProducts] = useState([]);
    const [Featuredproducts , setFeatuedproducts] =  useState([])
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

    useEffect(() => {
        getcategory();
    }, []);
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
            setPopularProducts(popularProducts);
            const featuredProduct = data.data.filter((item)=> item.isfeatured === true)
            setFeatuedproducts(featuredProduct)
            console.log("Popular Products:", popularProducts);
            console.log("featured",featuredProduct)
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        getcategory();
        getpopularproducts();
    }, []);

    return (
        <section className="w-full  px-2 py-4 sm:px-4 md:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1400px]">

                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
                        Popular Categories
                    </h2>

                    <button className="flex items-center gap-1 text-sm font-semibold text-green-500 transition hover:text-green-400 sm:text-base">
                        View All
                        <span className="text-xl leading-none">→</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-6">
                    {popularCategories.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => { navigation(`/category/${item._id}`) }}
                            className="group flex h-[210px] cursor-pointer flex-col items-center justify-between overflow-hidden rounded-md border-2 border-gray-200 bg-white px-3 py-4 transition-all duration-200 hover:border-green-500 sm:h-[215px]"
                        >
                            <div className="flex h-[155px] w-full items-center justify-center">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-contain p-2"
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
                    <button className="flex items-center gap-1 text-sm font-semibold text-green-500 transition hover:text-green-400 sm:text-base">
                        View All
                        <span className="text-xl leading-none">→</span>
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-6">
                    {popularproducts.map((item) => (
                        <div
                            key={item._id}
                            className="group flex h-[230px] cursor-pointer flex-col items-center justify-between overflow-hidden rounded-md border-2 border-gray-200 bg-white px-3 py-4 transition-all duration-200 hover:border-green-500 sm:h-[235px]"
                        >
                            <div className="flex h-[155px] w-full items-center justify-center">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-contain p-2"
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

                    <button className="flex items-center gap-1 text-sm font-semibold text-green-500 transition hover:text-green-400 sm:text-base">
                        View All
                        <span className="text-xl leading-none">→</span>
                    </button>
                </div>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-6">
                    {Featuredproducts.map((item) => (
                        <div
                            key={item._id}
                            className="group flex h-[230px] cursor-pointer flex-col items-center justify-between overflow-hidden rounded-md border-2 border-gray-200 bg-white px-3 py-4 transition-all duration-200 hover:border-green-500 sm:h-[235px]"
                        >
                            <div className="flex h-[155px] w-full items-center justify-center">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-contain p-2"
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
    );
};

export default Home;