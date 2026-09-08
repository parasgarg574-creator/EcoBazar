import React, { useEffect, useState } from "react";
import apimethods from "../../Methods/ApiClient";
import Swal from "sweetalert2";

const initialFormData = {
  question: "",
  answer: "",
  status: "published",
};

const AddEdit = ({ setShowForm, setFaqs, editFaq = null }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(editFaq);

  useEffect(() => {
    if (editFaq) {
      setFormData({
        question: editFaq.question || "",
        answer: editFaq.answer || "",
        status: editFaq.status || "published",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editFaq]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        question: formData.question,
        answer: formData.answer,
        status: formData.status,
      };

      if (isEditMode) {
        const faqId = editFaq._id || editFaq.id;
        if (!faqId) {
          throw new Error("FAQ ID not found");
        }
        const response = await apimethods.putApi(
          `/updateFaq/${faqId}`,
          payload
        );
        const updatedFaq = response?.data?.data || response?.data || response;
        setFaqs((prev) =>
          prev.map((faq) => {
            const currentId = faq._id || faq.id;
            return currentId === faqId ? { ...faq, ...updatedFaq } : faq;
          })
        );
        await Swal.fire({
          title: "FAQ Updated Successfully",
          icon: "success",
        });
      } else {
        const response = await apimethods.postApi("/createFaq", payload);
        const newFaq = response?.data?.data || response?.data || response;
        setFaqs((prev) => [...prev, newFaq]);
        await Swal.fire({
          title: "FAQ Added Successfully",
          icon: "success",
        });
      }
      setFormData(initialFormData);
      setShowForm(false);
    } catch (error) {
      console.error(
        isEditMode ? "Failed to update FAQ:" : "Failed to add FAQ:",
        error
      );
      Swal.fire({
        title: isEditMode ? "Failed to Update FAQ" : "Failed to Add FAQ",
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
            {isEditMode ? "Edit FAQ" : "Add FAQ"}
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
            htmlFor="question"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Question
          </label>
          <input id="question" type="text" name="question" value={formData.question} onChange={handleChange} placeholder="Enter question" required className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="answer" className="mb-2 block text-sm font-medium text-gray-700"
          >
            Answer
          </label>
          <textarea id="answer" name="answer" value={formData.answer} onChange={handleChange} placeholder="Enter answer" required rows={4} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
          />
        </div>
        <div className="mb-6">
          <label  htmlFor="status"  className="mb-2 block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-green-600 py-2.5 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Submitting..." : isEditMode ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
};
export default AddEdit;
