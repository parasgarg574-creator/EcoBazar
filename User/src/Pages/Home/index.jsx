// import apimethods from "../../Methods/ApiClient"
import { useEffect } from "react"
const Home = () => {
    const getcategory = async () => {
        try {
            const response = await fetch("http://localhost:5000/getcategory", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await response.json();
            const popularCategories = data.data.filter(
                (item) => item.ispopular === true
            );

            console.log(popularCategories);

        } catch (er) {
            console.log(er);
        }
    };
    useEffect(() => {
        getcategory();
    }, [])
    return (
        <>
            <h1>hello</h1>
        </>
    )
}
export default Home;