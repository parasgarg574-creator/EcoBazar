import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import apimethods from "../../Methods/ApiClient";
import Swal from "sweetalert2";
import Loader from "../../Common/Loader";

const resourceConfig = {
  categories: {
    title: "Category Details",
    endpoint: (id) => `/getSingle/${id}`,
    fields: [
      ["Name", "name"],
      ["Description", "description"],
      ["Popular", "ispopular", (value) => (value ? "Yes" : "No")],
      ["Featured", "isfeatured", (value) => (value ? "Yes" : "No")],
    ],
  },
  products: {
    title: "Product Details",
    endpoint: (id) => `/getProduct/${id}`,
    fields: [
      ["Name", "name"],
      ["Category", "category.name"],
      ["Price", "price", (value) => `₹${value ?? 0}`],
      ["Discount", "discount", (value) => `${value ?? 0}%`],
      ["Stock", "stock"],
      ["Description", "description"],
    ],
  },
  staff: {
    title: "Staff Details",
    endpoint: (id) => `/getSingleStaff/${id}`,
    fields: [
      ["Name", "name"],
      ["Email", "email"],
      ["Role", "role"],
    ],
  },
  faqs: {
    title: "FAQ Details",
    endpoint: (id) => `/getSingleFaq/${id}`,
    fields: [
      ["Question", "question"],
      ["Answer", "answer"],
      ["Status", "status"],
    ],
  },
};

const getNestedValue = (value, path) =>
  path.split(".").reduce((current, key) => current?.[key], value);

const Details = () => {
  const { resource, id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const config = resourceConfig[resource];

  useEffect(() => {
    if (!config || !id) return;

    const loadRecord = async () => {
      try {
        const response = await apimethods.getApi(config.endpoint(id));
        setRecord(response?.data?.data || response?.data || response);
      } catch (error) {
        Swal.fire({
          title: "Failed to Load Details",
          text: error?.response?.data?.message || "Something went wrong",
          icon: "error",
        }).then(() => navigate(-1));
      } finally {
        setLoading(false);
      }
    };

    loadRecord();
  }, [config, id, navigate]);

  if (!config) {
    return <p className="text-gray-600">Details page not found.</p>;
  }

  return (
    <div className="max-w-4xl">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#00491B]"
      >
        <ArrowLeft size={17} />
        Back
      </button>

      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <h1 className="mb-6 text-xl font-semibold text-[#333] sm:text-2xl">
          {config.title}
        </h1>

        {loading ? (
          <div className="flex min-h-32 items-center justify-center">
            <Loader label="Loading details..." />
          </div>
        ) : record ? (
          <div className="space-y-5">
            {record.image && (
              <img
                src={record.image}
                alt={record.name || "Record"}
                className="h-48 w-full max-w-md rounded-lg object-cover"
              />
            )}
            <dl className="grid gap-5 sm:grid-cols-2">
              {config.fields.map(([label, key, format]) => {
                const value = getNestedValue(record, key);
                return (
                  <div key={key} className="border-b border-gray-100 pb-3">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {label}
                    </dt>
                    <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-800">
                      {format ? format(value) : value ?? "-"}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No details found.</p>
        )}
      </div>
    </div>
  );
};

export default Details;
