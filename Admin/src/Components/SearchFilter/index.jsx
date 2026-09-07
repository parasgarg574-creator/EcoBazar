import { FiSearch, FiX } from "react-icons/fi";
const SearchFilter = ({
    searchValue = "",
    onSearchChange,
    searchPlaceholder = "Search...",
    filters = [],
    filterValues = {},
    onFilterChange,
    onClear,
}) => {
    const hasActiveFilters =
        Boolean(searchValue) ||
        Object.values(filterValues).some((value) => value && value !== "all");

    return (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative w-full sm:max-w-xs">
                <FiSearch
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                />
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                />
            </div>

            {filters.map((filter) => (
                <select
                    key={filter.key}
                    value={filterValues[filter.key] ?? "all"}
                    onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200 sm:w-auto"
                >
                    <option value="all">{filter.label}</option>
                    {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ))}

            {hasActiveFilters && onClear && (
                <button
                    type="button"
                    onClick={onClear}
                    className="flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-red-500"
                >
                    <FiX size={14} />
                    Clear
                </button>
            )}
        </div>
    );
};

export default SearchFilter;
