import { useEffect, useMemo, useState } from "react";
import AddEditFaq from "./AddEdit";
import apimethods from "../../Methods/ApiClient";
import Table from "../../Components/Table";
import SearchFilter from "../../Components/SearchFilter";
import permissions from "../../Methods/Permissions/script";
import Swal from "sweetalert2";

const Faq = () => {
  const [showForm, setShowForm] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "all" });
  const canCreateFaqs = permissions.isAllowed("createFaqs");
  const canEditFaqs = permissions.isAllowed("updateFaqs");
  const canDeleteFaqs = permissions.isAllowed("deleteFaqs");

  const getFaqs = async () => {
    try {
      const response = await apimethods.getApi("/getFaqs");
      const list = response?.data?.data || response?.data || response || [];
      setFaqs(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Failed to get FAQs:", error);
    }
  };

  useEffect(() => {
    getFaqs();
  }, []);

  const columns = [
    {
      key: "question",
      label: "Question",
    },
    {
      key: "answer",
      label: "Answer",
      render: (faq) => (
        <span className="line-clamp-2 max-w-xs text-sm text-gray-600">
          {faq?.answer || "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (faq) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${
            faq?.status === "published"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {faq?.status || "draft"}
        </span>
      ),
    },
  ];

  const handleViewFaq = async (faqId) => {
    if (!faqId || typeof faqId === "object") {
      console.error("Invalid FAQ ID:", faqId);
      return;
    }
    try {
      const response = await apimethods.getApi(`/getSingleFaq/${faqId}`);
      const faq = response?.data?.data || response?.data || response;
      Swal.fire({
        title: faq?.question || "FAQ Details",
        html: `
          <div style="text-align:left">
            <p><strong>Answer:</strong> ${faq?.answer || "-"}</p>
            <p style="margin-top:8px"><strong>Status:</strong> ${
              faq?.status || "-"
            }</p>
          </div>
        `,
        confirmButtonColor: "#00491B",
      });
    } catch (error) {
      console.error("Failed to get FAQ:", error);
      Swal.fire({
        title: "Failed to Get FAQ",
        text: error?.response?.data?.message || "Something went wrong",
        icon: "error",
      });
    }
  };

  const handleEditFaq = async (faqId) => {
    if (!canEditFaqs) return;
    if (!faqId || typeof faqId === "object") {
      console.error("Invalid FAQ ID:", faqId);
      return;
    }
    try {
      const response = await apimethods.getApi(`/getSingleFaq/${faqId}`);
      const faq = response?.data?.data || response?.data || response;
      if (!faq) {
        throw new Error("FAQ not found");
      }
      setSelectedFaq(faq);
      setShowForm(true);
    } catch (error) {
      console.error("Failed to get FAQ for edit:", error);
      Swal.fire({
        title: "Failed to Load FAQ",
        text: error?.response?.data?.message || "Something went wrong",
        icon: "error",
      });
    }
  };

  const handleDeleteFaq = async (faqId) => {
    if (!canDeleteFaqs) return;
    if (!faqId || typeof faqId === "object") {
      console.error("Invalid FAQ ID:", faqId);
      return;
    }
    const result = await Swal.fire({
      title: "Delete FAQ?",
      text: "This FAQ will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await apimethods.deleteApi(`/deleteFaq/${faqId}`);
      setFaqs((prev) =>
        prev.filter((faq) => {
          const currentId = faq._id || faq.id;
          return currentId !== faqId;
        })
      );
      await Swal.fire({
        title: "Deleted!",
        text: "FAQ has been deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
      Swal.fire({
        title: "Failed to Delete FAQ",
        text: error?.response?.data?.message || "Something went wrong",
        icon: "error",
      });
    }
  };

  const handleAddFaq = () => {
    setSelectedFaq(null);
    setShowForm(true);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setSearch("");
    setFilters({ status: "all" });
  };

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        faq?.question?.toLowerCase().includes(term) ||
        faq?.answer?.toLowerCase().includes(term);
      const matchesStatus =
        !filters.status ||
        filters.status === "all" ||
        faq?.status === filters.status;
      return matchesSearch && matchesStatus;
    });
  }, [faqs, search, filters]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-[#333] sm:text-[22px]">
          FAQs
        </h1>

        {canCreateFaqs && (
          <button
            onClick={handleAddFaq}
            className="h-[36px] w-full rounded-[6px] bg-[#00491B] px-4 text-[12px] font-semibold text-white transition hover:bg-[#019D3E] sm:w-auto"
          >
            Add FAQ
          </button>
        )}
      </div>

      {showForm ? (
        <AddEditFaq
          setShowForm={setShowForm}
          setFaqs={setFaqs}
          editFaq={selectedFaq}
        />
      ) : (
        <>
          <SearchFilter
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search FAQs..."
            filters={[
              {
                key: "status",
                label: "All Status",
                options: [
                  { value: "published", label: "Published" },
                  { value: "draft", label: "Draft" },
                ],
              },
            ]}
            filterValues={filters}
            onFilterChange={handleFilterChange}
            onClear={handleClearFilters}
          />

          <Table
            columns={columns}
            data={filteredFaqs}
            emptyMessage="No FAQs found"
            onView={handleViewFaq}
            onEdit={handleEditFaq}
            onDelete={handleDeleteFaq}
            canEdit={canEditFaqs}
            canDelete={canDeleteFaqs}
          />
        </>
      )}
    </>
  );
};

export default Faq;
