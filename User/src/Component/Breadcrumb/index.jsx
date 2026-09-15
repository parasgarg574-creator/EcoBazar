import { Link, useLocation } from "react-router-dom";
import { FiChevronRight, FiHome } from "react-icons/fi";

/**
 * Reusable Breadcrumb component.
 *
 * Usage:
 *   <Breadcrumb labels={{ "category": "Electronics", ":id": "Product Name" }} />
 *
 * The `labels` prop maps URL segments to human-readable names.
 * Dynamic segments like `:id` or the actual ID value can be mapped.
 *
 * Auto-generated from the current URL path:
 *   /products           → Home > Products
 *   /category/:id       → Home > Category > {labels[id]}
 *   /products/:id       → Home > Products > {labels[id]}
 */
const Breadcrumb = ({ labels = {} }) => {
    const location = useLocation();

    // Split path into segments, filtering out empty strings
    const segments = location.pathname.split("/").filter(Boolean);

    // Map segment → display name
    const getLabel = (segment) => {
        // Check the labels prop first (for dynamic values like category name, product name)
        if (labels[segment]) return labels[segment];

        // Otherwise, format the segment nicely
        return segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    };

    // Build breadcrumb items: [{label, path}]
    const crumbs = segments.map((segment, index) => {
        const path = "/" + segments.slice(0, index + 1).join("/");
        return { label: getLabel(segment), path };
    });

    if (crumbs.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className="w-full bg-gray-50 border-b border-gray-100">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                <ol className="flex items-center gap-1 py-2.5 flex-wrap">
                    {/* Home link */}
                    <li className="flex items-center gap-1 shrink-0">
                        <Link
                            to="/"
                            className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors text-sm"
                            aria-label="Home"
                        >
                            <FiHome size={13} />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                    </li>

                    {crumbs.map((crumb, index) => {
                        const isLast = index === crumbs.length - 1;

                        return (
                            <li key={crumb.path} className="flex items-center gap-1 min-w-0">
                                <FiChevronRight size={13} className="text-gray-400 shrink-0" />
                                {isLast ? (
                                    <span
                                        className="text-sm font-medium text-gray-800 truncate max-w-[160px] sm:max-w-[260px] lg:max-w-[400px]"
                                        title={crumb.label}
                                        aria-current="page"
                                    >
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <Link
                                        to={crumb.path}
                                        className="text-sm text-gray-500 hover:text-green-600 transition-colors truncate max-w-[120px] sm:max-w-[200px]"
                                        title={crumb.label}
                                    >
                                        {crumb.label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </nav>
    );
};

export default Breadcrumb;
