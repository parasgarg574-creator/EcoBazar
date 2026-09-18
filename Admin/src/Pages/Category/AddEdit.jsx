import React, { useEffect, useState } from "react";
import apimethods from "../../Methods/ApiClient";
import Swal from "sweetalert2";
import ImageUpload from "../../Common/ImageUpload/image";

const emptyCategory = {
  name: "",
  description: "",
  image: null,
  ispopular: false,
  isfeatured: false,
};

const AddEdit = ({
  setShowForm,
  setCategories,
  editCategory = null,
}) => {
  const [categoriesForm, setCategoriesForm] = useState([
    { ...emptyCategory },
  ]);

  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(editCategory);

  useEffect(() => {
    if (editCategory) {
      setCategoriesForm([
        {
          name: editCategory.name || "",
          description: editCategory.description || "",
          image: editCategory.image || null,
          ispopular: editCategory.ispopular ?? false,
          isfeatured: editCategory.isfeatured ?? false,
        },
      ]);
    } else {
      setCategoriesForm([{ ...emptyCategory }]);
    }
  }, [editCategory]);

  const handleChange = (index, e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setCategoriesForm((prev) =>
      prev.map((category, i) =>
        i === index
          ? {
              ...category,
              [name]:
                type === "checkbox"
                  ? checked
                  : value,
            }
          : category
      )
    );
  };

  const handleImageChange = (index, file) => {
    setCategoriesForm((prev) =>
      prev.map((category, i) =>
        i === index
          ? {
              ...category,
              image: file,
            }
          : category
      )
    );
  };

  const addMoreCategory = () => {
    setCategoriesForm((prev) => [
      ...prev,
      { ...emptyCategory },
    ]);
  };

  const removeCategory = (index) => {
    if (categoriesForm.length === 1) return;

    setCategoriesForm((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isEditMode) {
        const categoryId =
          editCategory._id || editCategory.id;

        if (!categoryId) {
          throw new Error("Category ID not found");
        }

        const data = new FormData();

        data.append(
          "name",
          categoriesForm[0].name
        );

        data.append(
          "description",
          categoriesForm[0].description
        );

        data.append(
          "ispopular",
          categoriesForm[0].ispopular
            ? "true"
            : "false"
        );

        data.append(
          "isfeatured",
          categoriesForm[0].isfeatured
            ? "true"
            : "false"
        );

        if (
          categoriesForm[0].image &&
          typeof categoriesForm[0].image !== "string"
        ) {
          data.append(
            "image",
            categoriesForm[0].image
          );
        }

        const response =
          await apimethods.putImageApi(
            `/updateCategory/${categoryId}`,
            data
          );

        const updatedCategory =
          response?.data?.data ||
          response?.data ||
          response;

        setCategories((prev) =>
          prev.map((category) => {
            const currentId =
              category._id || category.id;

            return currentId === categoryId
              ? {
                  ...category,
                  ...updatedCategory,
                }
              : category;
          })
        );

        await Swal.fire({
          title: "Category Updated Successfully",
          icon: "success",
        });
      } else {
        const newCategories = [];

        for (const category of categoriesForm) {
          if (!category.name.trim()) {
            continue;
          }

          const data = new FormData();

          data.append("name", category.name);
          data.append(
            "description",
            category.description
          );

          data.append(
            "ispopular",
            category.ispopular
              ? "true"
              : "false"
          );

          data.append(
            "isfeatured",
            category.isfeatured
              ? "true"
              : "false"
          );

          if (category.image) {
            data.append("image", category.image);
          }

          const response =
            await apimethods.postImageApi(
              "/addcategory",
              data
            );

          const newCategory =
            response?.data?.data ||
            response?.data ||
            response;

          newCategories.push(newCategory);
        }

        if (newCategories.length === 0) {
          throw new Error(
            "Please enter at least one category name"
          );
        }

        setCategories((prev) => [
          ...prev,
          ...newCategories,
        ]);

        await Swal.fire({
          title: "Categories Added Successfully",
          text: `${newCategories.length} categor${
            newCategories.length === 1
              ? "y"
              : "ies"
          } added successfully.`,
          icon: "success",
        });
      }

      setShowForm(false);
    } catch (error) {
      console.error(
        isEditMode
          ? "Failed to update category:"
          : "Failed to add categories:",
        error
      );

      Swal.fire({
        title: isEditMode
          ? "Failed to Update Category"
          : "Failed to Add Categories",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-2xl border border-green-100 bg-white p-4 shadow-lg sm:p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-green-700">
            {isEditMode
              ? "Edit Category"
              : "Add Categories"}
          </h2>

          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="text-xl text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {categoriesForm.map((category, index) => (
          <div
            key={index}
            className="mb-6 rounded-xl border border-gray-200 p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">
                Category {index + 1}
              </h3>

              {!isEditMode &&
                categoriesForm.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeCategory(index)
                    }
                    className="text-sm font-medium text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={category.name}
                onChange={(e) =>
                  handleChange(index, e)
                }
                placeholder="Enter category name"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>

              <input
                type="text"
                name="description"
                value={category.description}
                onChange={(e) =>
                  handleChange(index, e)
                }
                placeholder="Enter description"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
              />
            </div>

            <div className="mb-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  name="ispopular"
                  checked={category.ispopular}
                  onChange={(e) =>
                    handleChange(index, e)
                  }
                  className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />

                <span className="text-sm font-medium text-gray-700">
                  Mark as Popular Category
                </span>
              </label>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Image
              </label>

              <ImageUpload
                value={
                  typeof category.image === "string"
                    ? category.image
                    : null
                }
                onChange={(file) =>
                  handleImageChange(index, file)
                }
                label="Upload Category Image"
                accept="image/*"
                multiple={false}
                required={!isEditMode}
              />
            </div>
          </div>
        ))}

        {!isEditMode && (
          <button
            type="button"
            onClick={addMoreCategory}
            className="mb-4 w-full rounded-lg border border-green-600 py-2.5 font-semibold text-green-600 transition hover:bg-green-50"
          >
            + Add More Category
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-green-600 py-2.5 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Submitting..."
            : isEditMode
            ? "Update Category"
            : `Add ${
                categoriesForm.length
              } ${
                categoriesForm.length === 1
                  ? "Category"
                  : "Categories"
              }`}
        </button>
      </form>
    </div>
  );
};
export default AddEdit;