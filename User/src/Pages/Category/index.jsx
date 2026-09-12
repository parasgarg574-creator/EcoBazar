import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";       
const categoryProducts = ()=>{
    const {id} = useParams()
    const [products,setProducts] = useState([])
    const [category,setCategory] = useState({})
    const [loading,setLoading] = useState(true)
    const getCategoryProducts = async()=>{
        try {
            const response = await fetch(`http://localhost:5000/getSingle/${id}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            console.log("Category Data:", data.data);
            setProducts(data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching category products:", error);
            setLoading(false);
        }
    };
    console.log("Category Products:", products);
    useEffect(() => {
        getCategoryProducts();
    }, [id]);

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Category Products</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <div key={product._id} className="border rounded-md p-4">
                                <img src={product.image} alt={product.name} className="w-full h-auto" />
                                <h2 className="text-lg font-bold mt-2">{product.name}</h2>
                                <p className="text-gray-600">${product.price.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
export default categoryProducts