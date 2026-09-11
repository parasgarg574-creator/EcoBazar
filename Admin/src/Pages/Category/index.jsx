import { useEffect, useMemo, useState } from "react";
import AddEditCategory from "./AddEdit";
import apimethods from "../../Methods/ApiClient";
import Table from "../../Components/Table";
import SearchFilter from "../../Components/SearchFilter";
import permissions from "../../Methods/Permissions/script";
import Swal from "sweetalert2";
const Category = () => {
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    image: "all",
    ispopular: "all",
  });
  const canEditCategories =
    permissions.isAllowed("updateCategories");
  const canDeleteCategories =
    permissions.isAllowed("deleteCategories");
  const getCategories = async () => {
    try {
      const response = await apimethods.getApi("/getcategory");

      const list =
        response?.data?.data ||
        response?.data ||
        response ||
        [];
      setCategories(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Failed to get categories:", error);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  const columns = [
    {
      key: "name",
      label: "Name",
    },

    {
      key: "description",
      label: "Description",
    },

    {
      key: "image",
      label: "Image",
      render: (category) =>
        category?.image ? (
          <img
            src={category.image}
            alt={category.name || "Category"}
            className="h-12 w-12 rounded object-cover"
          />
        ) : (
          "-"
        ),
    },

    {
      key: "ispopular",
      label: "Popular",
      render: (category) =>
        category?.ispopular ? (
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Popular
          </span>
        ) : (
          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
            No
          </span>
        ),
    },
  ];

  const handleViewCategory = async (categoryId) => {
    if (!categoryId || typeof categoryId === "object") {
      console.error("Invalid category ID:", categoryId);
      return;
    }

    try {
      const response = await apimethods.getApi(
        `/getSingle/${categoryId}`
      );

      const category =
        response?.data?.data ||
        response?.data ||
        response;

      Swal.fire({
        title: category?.name || "Category Details",

        html: `
          <div style="text-align:left">
            <p>
              <strong>Name:</strong>
              ${category?.name || "-"}
            </p>

            <p>
              <strong>Description:</strong>
              ${category?.description || "-"}
            </p>

            <p>
              <strong>Popular:</strong>
              ${category?.ispopular ? "Yes" : "No"}
            </p>

            ${
              category?.image
                ? `
                  <img
                    src="${category.image}"
                    alt="${category.name || ""}"
                    style="
                      width:100%;
                      max-height:200px;
                      object-fit:cover;
                      border-radius:8px;
                      margin-top:10px;
                    "
                  />
                `
                : ""
            }
          </div>
        `,

        confirmButtonColor: "#00491B",
      });
    } catch (error) {
      console.error("Failed to get category:", error);

      Swal.fire({
        title: "Failed to Get Category",
        text:
          error?.response?.data?.message ||
          "Something went wrong",
        icon: "error",
      });
    }
  };

  const handleEditCategory = async (categoryId) => {
    if (!canEditCategories) return;

    if (!categoryId || typeof categoryId === "object") {
      console.error("Invalid category ID:", categoryId);
      return;
    }

    try {
      const response = await apimethods.getApi(
        `/getSingle/${categoryId}`
      );

      const category =
        response?.data?.data ||
        response?.data ||
        response;

      if (!category) {
        throw new Error("Category not found");
      }

      setSelectedCategory(category);
      setShowForm(true);
    } catch (error) {
      console.error(
        "Failed to get category for edit:",
        error
      );

      Swal.fire({
        title: "Failed to Load Category",
        text:
          error?.response?.data?.message ||
          "Something went wrong",
        icon: "error",
      });
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!canDeleteCategories) return;

    if (!categoryId || typeof categoryId === "object") {
      console.error("Invalid category ID:", categoryId);
      return;
    }

    const result = await Swal.fire({
      title: "Delete Category?",
      text: "This category will be permanently deleted.",
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
        `/deleteCategory/${categoryId}`
      );

      setCategories((prev) =>
        prev.filter((category) => {
          const currentId =
            category._id || category.id;

          return currentId !== categoryId;
        })
      );

      await Swal.fire({
        title: "Deleted!",
        text: "Category has been deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(
        "Failed to delete category:",
        error
      );

      Swal.fire({
        title: "Failed to Delete Category",
        text:
          error?.response?.data?.message ||
          "Something went wrong",
        icon: "error",
      });
    }
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
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
      image: "all",
      ispopular: "all",
    });
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const term = search.trim().toLowerCase();

      const matchesSearch =
        !term ||
        category?.name
          ?.toLowerCase()
          .includes(term) ||
        category?.description
          ?.toLowerCase()
          .includes(term);

      const matchesImage =
        !filters.image ||
        filters.image === "all" ||
        (filters.image === "with" &&
          Boolean(category?.image)) ||
        (filters.image === "without" &&
          !category?.image);

      const matchesPopular =
        !filters.ispopular ||
        filters.ispopular === "all" ||
        (filters.ispopular === "popular" &&
          category?.ispopular === true) ||
        (filters.ispopular === "not-popular" &&
          category?.ispopular !== true);

      return (
        matchesSearch &&
        matchesImage &&
        matchesPopular
      );
    });
  }, [categories, search, filters]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-[#333] sm:text-[22px]">
          Category
        </h1>
        <button
          onClick={handleAddCategory}
          className="h-[36px] w-full rounded-[6px] bg-[#00491B] px-4 text-[12px] font-semibold text-white transition hover:bg-[#019D3E] sm:w-auto"
        >
          Add Category
        </button>
      </div>

      {showForm ? (
        <AddEditCategory
          setShowForm={setShowForm}
          setCategories={setCategories}
          editCategory={selectedCategory}
        />
      ) : (
        <>
          <SearchFilter
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search categories..."
            filters={[
              {
                key: "image",
                label: "All Images",
                options: [
                  {
                    value: "with",
                    label: "Has Image",
                  },
                  {
                    value: "without",
                    label: "No Image",
                  },
                ],
              },

              {
                key: "ispopular",
                label: "All Categories",
                options: [
                  {
                    value: "popular",
                    label: "Popular",
                  },
                  {
                    value: "not-popular",
                    label: "Not Popular",
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
            data={filteredCategories}
            emptyMessage="No categories found"
            onView={handleViewCategory}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            canEdit={canEditCategories}
            canDelete={canDeleteCategories}
          />
        </>
      )}
    </>
  );
};
export default Category;