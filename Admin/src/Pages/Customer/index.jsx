// import { useEffect, useMemo, useState } from "react";
// import Swal from "sweetalert2";
// import SearchFilter from "../../Components/SearchFilter";
// import Table from "../../Components/Table";
// import apimethods from "../../Methods/ApiClient";
// const formatDate = (date) => {
//     if (!date) return "-";
//     return new Intl.DateTimeFormat("en", {
//         dateStyle: "medium",
//     }).format(new Date(date));
// };

// const escapeHtml = (value) =>
//     String(value)
//         .replaceAll("&", "&amp;")
//         .replaceAll("<", "&lt;")
//         .replaceAll(">", "&gt;")
//         .replaceAll('"', "&quot;")
//         .replaceAll("'", "&#039;");

// const Customers = () => {
//     const [customers, setCustomers] = useState([]);
//     const [search, setSearch] = useState("");
//     const [loading, setLoading] = useState(true);

//     const getCustomers = async () => {
//         try {
//             const response = await apimethods.getApi("/customers");
//             const customerList = response?.data?.data || [];
//             setCustomers(Array.isArray(customerList) ? customerList : []);
//         } catch (error) {
//             Swal.fire({
//                 title: "Failed to Load Customers",
//                 text: error?.response?.data?.message || "Something went wrong",
//                 icon: "error",
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         const loadCustomers = window.setTimeout(() => {
//             getCustomers();
//         }, 0);

//         return () => window.clearTimeout(loadCustomers);
//     }, []);

//     const filteredCustomers = useMemo(() => {
//         const term = search.trim().toLowerCase();
//         if (!term) return customers;

//         return customers.filter(
//             (customer) =>
//                 customer?.name?.toLowerCase().includes(term) ||
//                 customer?.email?.toLowerCase().includes(term)
//         );
//     }, [customers, search]);

//     const handleViewCustomer = (customerId) => {
//         const customer = customers.find(
//             (item) => (item?._id || item?.id) === customerId
//         );

//         if (!customer) return;

//         Swal.fire({
//             titleText: customer.name || "Customer Details",
//             html: `
//                 <div style="text-align:left">
//                     <p><strong>Email:</strong> ${escapeHtml(customer.email || "-")}</p>
//                     <p><strong>Status:</strong> ${escapeHtml(customer.isActive ? "Active" : "Inactive")}</p>
//                     <p><strong>Signed up:</strong> ${escapeHtml(formatDate(customer.createdAt))}</p>
//                     <p><strong>Last login:</strong> ${escapeHtml(formatDate(customer.lastLogin))}</p>
//                 </div>
//             `,
//             confirmButtonColor: "#00491B",
//         });
//     };

//     const columns = [
//         { key: "name", label: "Name" },
//         { key: "email", label: "Email" },
//         {
//             key: "createdAt",
//             label: "Signed Up",
//             render: (customer) => formatDate(customer.createdAt),
//         },
//         {
//             key: "isActive",
//             label: "Status",
//             render: (customer) => (customer.isActive ? "Active" : "Inactive"),
//         },
//     ];

//     return (
//         <>
//             <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                     <h1 className="text-xl font-semibold text-[#333] sm:text-[22px]">
//                         Customers
//                     </h1>
//                     <p className="mt-1 text-sm text-gray-500">
//                         View accounts registered through the storefront.
//                     </p>
//                 </div>
//                 <span className="text-sm text-gray-500">
//                     {customers.length} {customers.length === 1 ? "customer" : "customers"}
//                 </span>
//             </div>

//             <SearchFilter
//                 searchValue={search}
//                 onSearchChange={setSearch}
//                 searchPlaceholder="Search customers..."
//                 filters={[]}
//                 filterValues={{}}
//                 onFilterChange={() => {}}
//                 onClear={() => setSearch("")}
//             />

//             {loading ? (
//                 <div className="py-12 text-center text-gray-500">Loading customers...</div>
//             ) : (
//                 <Table
//                     columns={columns}
//                     data={filteredCustomers}
//                     emptyMessage="No customers found"
//                     onView={handleViewCustomer}
//                     canEdit={false}
//                     canDelete={false}
//                 />
//             )}
//         </>
//     );
// };

// export default Customers;    