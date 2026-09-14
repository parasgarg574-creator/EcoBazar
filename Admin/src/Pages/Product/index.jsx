import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import AddEditProduct from "./AddEdit"
import ReactPaginateRaw from "react-paginate";
const ReactPaginate = ReactPaginateRaw?.default?.default || ReactPaginateRaw?.default || ReactPaginateRaw;
import apimethods from "../../Methods/ApiClient";
import Table from "../../Components/Table/index"
import SearchFilter from "../../Components/SearchFilter/index";
import permissions from "../../Methods/Permissions/script";
const Product = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [active, setActive] = useState(1);
    const [totalProducts, setTotalproducts] = useState(0)
    const [showForm, setShowForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        categoryID: "all",
        stock: "all",
    });
    const canEditProducts = permissions.isAllowed("updateProducts");
    const canDeleteProducts = permissions.isAllowed("deleteProducts");
    const itemsperpage = 10;
    const getProducts = async () => {
        try {
            const response = await apimethods.getApi(
                `/all?page=${active}&limit=${itemsperpage}`
            );

            const responseData = response?.data;

            const data = responseData?.data || [];

            setProducts(Array.isArray(data) ? data : []);

            setTotalproducts(responseData?.totalProducts || 0);
        } catch (error) {
            console.error("Failed to get products:", error);

            Swal.fire({
                title: "Failed to Load Products",
                text:
                    error?.response?.data?.message ||
                    "Something went wrong",
                icon: "error",
            });
        }
    };

    const getCategories = async () => {
        try {
            const response = await apimethods.getApi("/getcategory");
            const data = response?.data?.data || response?.data || [];
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to get categories:", error);
            Swal.fire({
                title: "Failed to Load Categories",
                text: error?.response?.data?.message || "Something went wrong",
                icon: "error",
            });
        }
    };
    useEffect(() => {
        getProducts()
    }, [active])
    useEffect(() => {
        getCategories();
    }, []);
    useEffect(() => {
        setActive(1);
    }, [search, filters]);
    const pageCount = Math.max(1, Math.ceil(totalProducts / itemsperpage));
    useEffect(() => {
        if (active > pageCount) {
            setActive(pageCount);
        }
    }, [pageCount, active]);
    const columns = [
        {
            key: "name",
            label: "Product",
        },
        {
            key: "category",
            label: "Category",
            render: (product) => product?.category?.name || "-",
        },
        {
            key: "price",
            label: "Price",
            render: (product) => `₹${product?.price ?? 0}`,
        },
        {
            key: "discount",
            label: "Discount",
            render: (product) => `${product?.discount ?? 0}%`,
        },
        {
            key: "stock",
            label: "Stock",
        },
        {
            key: "ispopular",
            label: "Popular",
            render: (product) => (
                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${product?.ispopular === true ||
                        product?.ispopular === "true"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                        }`}
                >
                    {product?.ispopular === true ||
                        product?.ispopular === "true"
                        ? "Yes"
                        : "No"}
                </span>
            ),
        },
        {
            key: "isfeatured",
            label: "Featured",
            render: (product) => (
                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${product?.isfeatured === true ||
                        product?.isfeatured === "true"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                        }`}
                >
                    {product?.isfeatured === true ||
                        product?.isfeatured === "true"
                        ? "Yes"
                        : "No"}
                </span>
            ),
        },
        {
            key: "image",
            label: "Image",
            render: (product) =>
                product?.image ? (
                    <img
                        src={product.image}
                        alt={product.name || "Product"}
                        className="h-12 w-12 rounded object-cover"
                    />
                ) : (
                    "-"
                ),
        },
    ];
    const handleViewProduct = async (productId) => {
        if (!productId) {
            console.error("Product ID is missing");
            return;
        }
        try {
            const response = await apimethods.getApi(
                `/getProduct/${productId}`
            );
            const product = response?.data?.data || response?.data;
            if (!product) {
                throw new Error("Product not found");
            }
            Swal.fire({
                title: product.name || "Product Details",

                html: `
          <div style="text-align: left">

            ${product.image
                        ? `
                  <img
                    src="${product.image}"
                    alt="${product.name || "Product"}"
                    style="
                      width: 100%;
                      max-height: 220px;
                      object-fit: cover;
                      border-radius: 8px;
                      margin-bottom: 15px;
                    "
                  />
                `
                        : ""
                    }

            <p>
              <strong>Name:</strong>
              ${product.name || "-"}
            </p>

            <p>
              <strong>Category:</strong>
              ${product.category?.name || "-"}
            </p>

            <p>
              <strong>Price:</strong>
              ₹${product.price ?? 0}
            </p>

            <p>
              <strong>Discount:</strong>
              ${product.discount ?? 0}%
            </p>

            <p>
              <strong>Stock:</strong>
              ${product.stock ?? 0}
            </p>

            <p>
              <strong>Description:</strong>
              ${product.description || "-"}
            </p>

          </div>
        `,

                confirmButtonColor: "#00491B",
            });
        } catch (error) {
            console.error("Failed to get product:", error);

            Swal.fire({
                title: "Failed to Get Product",
                text: error?.response?.data?.message || "Something went wrong",
                icon: "error",
            });
        }
    };
    const handleEditProduct = async (productId) => {
        if (!canEditProducts) return;

        if (!productId) {
            console.error("Product ID is missing");
            return;
        }

        try {
            const response = await apimethods.getApi(
                `/getProduct/${productId}`
            );

            const product = response?.data?.data || response?.data;

            if (!product) {
                throw new Error("Product not found");
            }

            setSelectedProduct(product);
            setShowForm(true);
        } catch (error) {
            console.error("Failed to get product:", error);

            Swal.fire({
                title: "Failed to Load Product",
                text: error?.response?.data?.message || "Something went wrong",
                icon: "error",
            });
        }
    };
    const handleDeleteProduct = async (productId) => {
        if (!canDeleteProducts) return;

        if (!productId) {
            console.error("Product ID is missing");
            return;
        }

        const result = await Swal.fire({
            title: "Delete Product?",
            text: "This product will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {
            await apimethods.deleteApi(
                `/deleteProduct/${productId}`
            );
            await getProducts();

            Swal.fire({
                title: "Deleted!",
                text: "Product has been deleted successfully.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Failed to delete product:", error);

            Swal.fire({
                title: "Failed to Delete Product",
                text: error?.response?.data?.message || "Something went wrong",
                icon: "error",
            });
        }
    };
    const handleAddProduct = () => {
        setSelectedProduct(null);
        setShowForm(true);
    };
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };
    const handleClearFilters = () => {
        setSearch("");

        setFilters({
            categoryID: "all",
            stock: "all",
        });
    };
    const filteredProducts = useMemo(() => {
        const searchText = search.trim().toLowerCase();

        return products.filter((product) => {
            const matchesSearch =
                !searchText ||
                product.name?.toLowerCase().includes(searchText) ||
                product.description?.toLowerCase().includes(searchText);
            const categoryId =
                product.category?._id ||
                product.categoryID?._id ||
                product.categoryID;
            const matchesCategory =
                filters.categoryID === "all" ||
                categoryId === filters.categoryID;
            let matchesStock = true;
            if (filters.stock === "inStock") {
                matchesStock = Number(product.stock) > 0;
            }
            if (filters.stock === "outOfStock") {
                matchesStock = Number(product.stock) === 0;
            }
            return (
                matchesSearch &&
                matchesCategory &&
                matchesStock
            );
        });
    }, [products, search, filters]);
    // console.log({
    //     Pagination,
    //     Table,
    //     SearchFilter,
    //     AddEditProduct,
    // });

    return (
        <>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-semibold text-[#333] sm:text-[22px]">
                    Products
                </h1>

                <button
                    onClick={handleAddProduct}
                    className="h-[36px] w-full rounded-[6px] bg-[#00491B] px-4 text-[12px] font-semibold text-white transition hover:bg-[#019D3E] sm:w-auto"
                >
                    Add Product
                </button>
            </div>
            {showForm ? (
                <AddEditProduct
                    setShowForm={setShowForm}
                    setProducts={setProducts}
                    refreshProducts={getProducts}
                    categories={categories}
                    editProduct={selectedProduct}
                />
            ) : (
                <>
                    <SearchFilter
                        searchValue={search}
                        onSearchChange={setSearch}
                        searchPlaceholder="Search products..."
                        filters={[
                            {
                                key: "categoryID",
                                label: "All Categories",
                                options: categories.map((category) => ({
                                    value: category._id || category.id,
                                    label: category.name,
                                })),
                            },

                            {
                                key: "stock",
                                label: "All Stock",
                                options: [
                                    {
                                        value: "inStock",
                                        label: "In Stock",
                                    },
                                    {
                                        value: "outOfStock",
                                        label: "Out of Stock",
                                    },
                                ],
                            },
                        ]}
                        filterValues={filters}
                        onFilterChange={handleFilterChange}
                        onClear={handleClearFilters}
                    />
                    <Table
                        columns={columns}
                        data={filteredProducts}
                        emptyMessage="No products found"
                        onView={handleViewProduct}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                        canEdit={canEditProducts}
                        canDelete={canDeleteProducts}
                    />
                    <ReactPaginate
                        previousLabel="← Previous"
                        nextLabel="Next →"
                        breakLabel="..."
                        pageCount={pageCount}
                        onPageChange={(selectedItem) => {
                            setActive(selectedItem.selected + 1);
                        }}
                        forcePage={active - 1}
                        pageRangeDisplayed={5}
                        marginPagesDisplayed={1}
                        containerClassName="flex items-center justify-center gap-2 mt-6"
                        pageClassName="px-3 py-1 border rounded cursor-pointer"
                        pageLinkClassName="cursor-pointer"
                        previousClassName="px-3 py-1 border rounded cursor-pointer"
                        nextClassName="px-3 py-1 border rounded cursor-pointer"
                        breakClassName="px-3 py-1"
                        activeClassName="bg-[#00491B] text-white"
                        disabledClassName="opacity-50 cursor-not-allowed"
                    />

                </>
            )}
        </>
    );
};
export default Product;
