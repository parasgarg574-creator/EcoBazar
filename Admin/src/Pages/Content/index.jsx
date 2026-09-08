import { useEffect, useState } from "react";
import apimethods from "../../Methods/ApiClient";
import permissions from "../../Methods/Permissions/script";
import Swal from "sweetalert2";
const PAGES = [
  { key: "terms-and-conditions", label: "Terms & Conditions" },
  { key: "privacy-policy", label: "Privacy Policy" },
];
const emptyContent = { title: "", content: "", status: "draft" };
const ContentManagement = () => {
  const [activePage, setActivePage] = useState(PAGES[0].key);
  const [contentByPage, setContentByPage] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(emptyContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const canEditContent = permissions.isAllowed("updateContent");
  const activeContent = contentByPage[activePage] || null;
  const getContent = async (page) => {
    setLoading(true);
    try {
      const response = await apimethods.getApi(`/getContentByPage/${page}`);
      const data = response?.data?.data || response?.data || response;
      setContentByPage((prev) => ({ ...prev, [page]: data || null }));
    } catch (error) {
      setContentByPage((prev) => ({ ...prev, [page]: null }));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getContent(activePage);
    setIsEditing(false);
  }, [activePage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const startEditing = () => {
    if (!canEditContent) return;
    setFormData({
      title: activeContent?.title || PAGES.find((p) => p.key === activePage)?.label || "",
      content: activeContent?.content || "",
      status: activeContent?.status || "draft",
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setFormData(emptyContent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await apimethods.putApi(
        `/updateContent/${activePage}`,
        formData
      );
      const updated = response?.data?.data || response?.data || response;
      setContentByPage((prev) => ({ ...prev, [activePage]: updated }));
      setIsEditing(false);
      await Swal.fire({
        title: "Content Saved Successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to save content:", error);
      Swal.fire({
        title: "Failed to Save Content",
        text: error?.response?.data?.message || "Something went wrong",
        icon: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-[#333] sm:text-[22px]">
          Content Management
        </h1>
      </div>

      <div className="mb-6 flex gap-2 border-b border-gray-200">
        {PAGES.map((page) => (
          <button
            key={page.key}
            onClick={() => setActivePage(page.key)}
            className={`px-4 py-2 text-sm font-medium transition ${
              activePage === page.key
                ? "border-b-2 border-[#00491B] text-[#00491B]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {page.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : isEditing ? (
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl rounded-2xl border border-green-100 bg-white p-8 shadow-lg"
        >
          <div className="mb-4">
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="content"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter page content"
              required
              rows={14}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={cancelEditing}
              disabled={saving}
              className="rounded-lg border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {activeContent?.title ||
                  PAGES.find((p) => p.key === activePage)?.label}
              </h2>
              <span
                className={`mt-2 inline-block rounded-full px-2 py-1 text-xs font-medium capitalize ${
                  activeContent?.status === "published"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {activeContent?.status || "not created yet"}
              </span>
            </div>

            {canEditContent && (
              <button
                onClick={startEditing}
                className="h-[36px] shrink-0 rounded-[6px] bg-[#00491B] px-4 text-[12px] font-semibold text-white transition hover:bg-[#019D3E]"
              >
                {activeContent ? "Edit" : "Create"}
              </button>
            )}
          </div>

          {activeContent?.content ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
              {activeContent.content}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              This page hasn't been created yet.
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default ContentManagement;
