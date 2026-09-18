import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../Component/Navbar";
import Footer from "../../Component/Footer";
const pageLabels = {
    "terms-and-conditions": "Terms & Conditions",
    "privacy-policy": "Privacy Policy",
};
const LegalContent = () => {
    const { page } = useParams();
    console.log("Page parameter:", page);
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const label = pageLabels[page] || "Information";

    useEffect(() => {
        let active = true;

        const fetchContent = async () => {
            setLoading(true);
            setError(false);
            setContent(null);
            try {
                const response = await fetch(`http://localhost:5000/getPublishedContent/${page}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch content");
                }
               const data = await response.json();
                if (active) {
                    setContent(data?.data || null);
                }
            } catch (err) {
                if (active) {
                    setError(true);
                    setContent(null);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };
        fetchContent();
        return () => {
            active = false;
        };
    }, [page]);
    return (
        <div className="flex min-h-screen flex-col bg-[#f7f8f9]">
            <Navbar />

            <main className="flex-1">
                <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
                    <div className="mb-8">
                        <Link
                            to="/"
                            className="text-sm font-medium text-green-600 hover:text-green-700"
                        >
                            ← Back to home
                        </Link>

                        <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                            {content?.title || label}
                        </h1>
                    </div>

                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
                        {loading ? (
                            <p className="text-gray-500">
                                Loading {label.toLowerCase()}...
                            </p>
                        ) : error || !content ? (
                            <p className="text-gray-500">
                                {label} is not available yet.
                            </p>
                        ) : (
                            <div className="whitespace-pre-wrap break-words text-[15px] leading-8 text-gray-600">
                                {content.content}
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};
export default LegalContent;
