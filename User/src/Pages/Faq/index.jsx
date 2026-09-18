import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Component/Navbar";
import Footer from "../../Component/Footer";
import apimethods from "../../Methods/ApiClient";
const Faq = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    useEffect(() => {
        let active = true;
        apimethods.getApi("/getPublishedFaqs")
            .then((response) => {
                if (active) setFaqs(Array.isArray(response?.data?.data) ? response.data.data : []);
            })
            .catch(() => {
                if (active) setError(true);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);
    return (
        <div className="flex min-h-screen flex-col bg-[#f7f8f9]">
            <Navbar />
            <main className="flex-1">
                <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
                    <div className="mb-8">
                        <Link to="/" className="text-sm font-medium text-green-600 hover:text-green-700">
                            ← Back to home
                        </Link>
                        <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">Frequently Asked Questions</h1>
                        <p className="mt-3 text-gray-500">Find answers to common questions about EcoBazar.</p>
                    </div>

                    {loading ? (
                        <p className="text-gray-500">Loading FAQs...</p>
                    ) : error ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
                            FAQs are not available right now.
                        </div>
                    ) : faqs.length === 0 ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
                            No FAQs have been published yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {faqs.map((faq) => (
                                <details key={faq._id} className="group rounded-2xl border border-gray-200 bg-white shadow-sm">
                                    <summary className="cursor-pointer list-none px-6 py-5 text-base font-semibold text-gray-900 marker:hidden">
                                        <span className="flex items-center justify-between gap-4">
                                            {faq.question}
                                            <span className="text-xl font-normal text-green-600 transition-transform group-open:rotate-45">+</span>
                                        </span>
                                    </summary>
                                    <div className="whitespace-pre-wrap border-t border-gray-100 px-6 py-5 text-[15px] leading-7 text-gray-600">
                                        {faq.answer}
                                    </div>
                                </details>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Faq;
