import React, { useEffect, useState } from "react";
import apimethods from "../../Methods/ApiClient";
import Swal from "sweetalert2";
import ImageUpload from "../../Common/ImageUpload/image";

const initialFormData = {
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
  const [formData, setFormData] =
    useState(initialFormData);

  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(editCategory);

  useEffect(() => {
    if (editCategory) {
      setFormData({
        name: editCategory.name || "",
        description: editCategory.description || "",
        image: editCategory.image || null,

        // Important
        ispopular: editCategory.ispopular ?? false,
        isfeatured: editCategory.isfeatured ?? false,
      });
    } else {
      setFormData({
        ...initialFormData,
      });
    }
  }, [editCategory]);

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleImageChange = (file) => {
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append(
        "description",
        formData.description
      );
      data.append(
        "ispopular",
        formData.ispopular ? "true" : "false"
      );

      if (
        formData.image &&
        typeof formData.image !== "string"
      ) {
        data.append(
          "image",
          formData.image
        );
      }

      if (isEditMode) {
        const categoryId =
          editCategory._id ||
          editCategory.id;

        if (!categoryId) {
          throw new Error(
            "Category ID not found"
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
              category._id ||
              category.id;

            return currentId === categoryId
              ? {
                  ...category,
                  ...updatedCategory,
                }
              : category;
          })
        );

        await Swal.fire({
          title:
            "Category Updated Successfully",
          icon: "success",
        });
      } else {
        const response =
          await apimethods.postImageApi(
            "/addcategory",
            data
          );

        const newCategory =
          response?.data?.data ||
          response?.data ||
          response;

        setCategories((prev) => [
          ...prev,
          newCategory,
        ]);

        await Swal.fire({
          title:
            "Category Added Successfully",
          icon: "success",
        });
      }

      setFormData({
        ...initialFormData,
      });

      setShowForm(false);
    } catch (error) {
      console.error(
        isEditMode
          ? "Failed to update category:"
          : "Failed to add category:",
        error
      );

      Swal.fire({
        title: isEditMode
          ? "Failed to Update Category"
          : "Failed to Add Category",

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
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-green-100 bg-white p-8 shadow-lg"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-green-700">
            {isEditMode
              ? "Edit Category"
              : "Add Category"}
          </h2>

          <button
            type="button"
            onClick={() =>
              setShowForm(false)
            }
            className="text-xl text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <input
            id="description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
          />
        </div>
        <div className="mb-6">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="ispopular"
              checked={formData.ispopular}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />

            <span className="text-sm font-medium text-gray-700">
              Mark as Popular Category
            </span>
          </label>
        </div>
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Image
          </label>
          <ImageUpload
            value={
              typeof formData.image === "string"
                ? formData.image
                : null
            }
            onChange={handleImageChange}
            label="Upload Category Image"
            accept="image/*"
            multiple={false}
            required={!isEditMode}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-green-600 py-2.5 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Submitting..."
            : isEditMode
            ? "Update"
            : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddEdit;