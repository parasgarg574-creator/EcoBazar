import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import apimethods from "../../Methods/ApiClient";
import ImageUpload from "../../Common/ImageUpload/image";
const initialFormData = {
  categoryID: "",
  name: "",
  price: "",
  discount: "",
  stock: "",
  description: "",
  ispopular: false,
  isfeatured: false,
  image: null,
};
const AddEditProduct = ({
  setShowForm,
  setProducts,
  refreshProducts,
  categories = [],
  editProduct = null,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(editProduct);
  useEffect(() => {
    if (!editProduct) {
      setFormData(initialFormData);
      return;
    }

   setFormData({
    categoryID:
        editProduct.categoryID?._id ||
        editProduct.categoryID ||
        editProduct.category?._id ||
        "",

    name: editProduct.name || "",
    price: editProduct.price ?? "",
    discount: editProduct.discount ?? "",
    stock: editProduct.stock ?? "",
    description: editProduct.description || "",

    ispopular:
        editProduct.ispopular === true ||
        editProduct.ispopular === "true",

    isfeatured:
        editProduct.isfeatured === true ||
        editProduct.isfeatured === "true",

    image: editProduct.image || null,
});
  }, [editProduct]);
 const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
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
    setLoading(true);
    try {
      const form = new FormData();
      form.append("categoryID", formData.categoryID);
      form.append("name", formData.name);
      form.append("price", formData.price);
      form.append("discount", formData.discount);
      form.append("stock", formData.stock);
      form.append("description", formData.description);
      form.append("ispopular", String(formData.ispopular));
      form.append("isfeatured", String(formData.isfeatured));

      if (
        formData.image &&
        typeof formData.image !== "string"
      ) {
        form.append("image", formData.image);
      }

      let response;
      if (isEditMode) {
        const productId =
          editProduct._id || editProduct.id;

        if (!productId) {
          throw new Error("Product ID not found");
        }

        response = await apimethods.putImageApi(
          `/updateProduct/${productId}`,
          form
        );

        const updatedProduct =
          response?.data?.data || response?.data;

        if (typeof refreshProducts === "function") {
          // Re-fetch the current page from the server so the list reflects
          // what's actually there (correct totalProducts/pageCount).
          await refreshProducts();
        } else if (typeof setProducts === "function") {
          setProducts((prevProducts) =>
            prevProducts.map((product) => {
              const id = product._id || product.id;

              return id === productId
                ? {
                  ...product,
                  ...updatedProduct,
                }
                : product;
            })
          );
        }

        await Swal.fire({
          title: "Product Updated Successfully",
          icon: "success",
        });
      }
      else {
        response = await apimethods.postImageApi(
          "/create",
          form
        );

        const newProduct =
          response?.data?.data || response?.data;

        if (!newProduct) {
          throw new Error("Product was not created");
        }

        if (typeof refreshProducts === "function") {
          // Re-fetch instead of pushing the new product into local state.
          // Pushing made the current page hold 11 items instead of 10 and
          // never incremented totalProducts, so the pagination controls
          // undercounted the pages and the new product could end up on a
          // page the UI claimed didn't exist.
          await refreshProducts();
        } else if (typeof setProducts === "function") {
          setProducts((prevProducts) => [
            ...prevProducts,
            newProduct,
          ]);
        }

        await Swal.fire({
          title: "Product Added Successfully",
          icon: "success",
        });
      }
      setFormData(initialFormData);
      setShowForm(false);
    } catch (error) {
      console.error(
        isEditMode
          ? "Failed to update product:"
          : "Failed to add product:",
        error
      );

      Swal.fire({
        title: isEditMode
          ? "Failed to Update Product"
          : "Failed to Add Product",

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
            {isEditMode ? "Edit Product" : "Add Product"}
          </h2>

          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="text-xl text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>
        <div className="mb-4">
          <label
            htmlFor="categoryID"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Category
          </label>

          <select
            id="categoryID"
            name="categoryID"
            value={formData.categoryID}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option
                key={category._id || category.id}
                value={category._id || category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Product Name
          </label>

          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Price
            </label>

            <input
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              min="0"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div>
            <label
              htmlFor="discount"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Discount (%)
            </label>

            <input
              id="discount"
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Discount"
              min="0"
              max="100"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div>
            <label
              htmlFor="stock"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Stock
            </label>

            <input
              id="stock"
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Stock"
              min="0"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
            />
          </div>
        </div>
        <div className="mb-4 mt-4">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows={4}
            required
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
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
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="isfeatured"
              checked={formData.isfeatured}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />

            <span className="text-sm font-medium text-gray-700">
              Mark as Featured Product
            </span>
          </label>
        </div>
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Product Image
          </label>
          <ImageUpload
            value={
              typeof formData.image === "string"
                ? formData.image
                : null
            }
            onChange={handleImageChange}
            label="Upload Product Image"
            accept="image/*"
            multiple={false}
            required={!isEditMode}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-green-600 py-2.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Submitting..."
            : isEditMode
              ? "Update Product"
              : "Add Product"}
        </button>
      </form>
    </div>
  );
};
export default AddEditProduct;
