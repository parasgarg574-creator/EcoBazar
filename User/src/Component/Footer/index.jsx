import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="mt-auto border-t border-gray-200 bg-white py-8">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                    <Link to="/" className="shrink-0">
                        <img src="/Logo (1).png" alt="EcoBazar" className="h-8 w-auto object-contain" />
                    </Link>
                    <p className="text-center text-xs text-gray-400">
                        © 2026 EcoBazar. All rights reserved. Fresh &amp; Organic Food.
                    </p>
                    <nav className="flex flex-wrap justify-center gap-4 text-xs text-gray-400" aria-label="Footer navigation">
                        <Link to="/privacy-policy" className="transition-colors hover:text-green-600">Privacy Policy</Link>
                        <Link to="/terms-and-conditions" className="transition-colors hover:text-green-600">Terms &amp; Conditions</Link>
                        <Link to="/faq" className="transition-colors hover:text-green-600">FAQs</Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
