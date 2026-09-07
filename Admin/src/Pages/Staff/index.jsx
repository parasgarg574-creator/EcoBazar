import { useEffect, useMemo, useState } from "react";
import AddEditStaff from "./AddEdit";
import apimethods from "../../Methods/ApiClient";
import Table from "../../Components/Table";
import SearchFilter from "../../Components/SearchFilter";
import permissions from "../../Methods/Permissions/script";
import Swal from "sweetalert2";
const Staff = () => {
    const [showForm, setShowForm] = useState(false);
    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({ role: "all" });

    // Managing staff (create/update/delete) is restricted to admins only on
    // the backend (see Routes/Staff/script.js), so mirror that here rather
    // than trusting the permissions list for these two actions.
    const canEditStaff = permissions.isAdmin();
    const canDeleteStaff = permissions.isAdmin();
    const getStaffList = async () => {
        try {
            const response = await apimethods.getApi("/getStaff");
            const staff =
                response?.data?.data ||
                response?.data ||
                response ||
                [];
            setStaffList(Array.isArray(staff) ? staff : []);
        } catch (error) {
            console.error("Failed to get staff:", error);

           
        }
    };

    useEffect(() => {
        getStaffList();
    }, []);
    const columns = [
        {
            key: "name",
            label: "Name",
        },
        {
            key: "email",
            label: "Email",
        },
        {
            key: "role",
            label: "Role",
        },
    ];
    const handleViewStaff = async (staffId) => {
        console.log("Received staffId:", staffId);

        if (!staffId || typeof staffId === "object") {
            console.error("Invalid staff ID:", staffId);
            return;
        }
        try {
            const response = await apimethods.getApi(
                `/getSingleStaff/${staffId}`
            );
            console.log("Staff details:", response);

            const staff =
                response?.data?.data ||
                response?.data ||
                response;
            Swal.fire({
                title: staff?.name || "Staff Details",
                html: `
                    <div style="text-align:left">
                        <p><strong>Name:</strong> ${staff?.name || "-"}</p>
                        <p><strong>Email:</strong> ${staff?.email || "-"}</p>
                        <p><strong>Role:</strong> ${staff?.role || "-"}</p>
                    </div>
                `,
                confirmButtonColor: "#00491B",
            });
        } catch (error) {
            console.error("Failed to get staff:", error);
            Swal.fire({
                title: "Failed to Get Staff",
                text:
                    error?.response?.data?.message ||
                    "Something went wrong",
                icon: "error",
            });
        }
    };
    const handleEditStaff = async (staffId) => {
        console.log("Edit staff with ID:", staffId);

        if (!canEditStaff) return;
        if (!staffId || typeof staffId === "object") {
            console.error("Invalid staff ID:", staffId);
            return;
        }
        try {
            const response = await apimethods.getApi(
                `/getSingleStaff/${staffId}`
            );
            console.log("Staff details:", response);
            const staff =
                response?.data?.data ||
                response?.data ||
                response;
            if (!staff) {
                throw new Error("Staff not found");
            }
            setSelectedStaff(staff);
            setShowForm(true);
        } catch (error) {
            console.error("Failed to get staff for edit:", error);

            Swal.fire({
                title: "Failed to Load Staff",
                text:
                    error?.response?.data?.message ||
                    "Something went wrong",
                icon: "error",
            });
        }
    };
    const handleDeleteStaff = async (staffId) => {
        console.log("Delete staff with ID:", staffId);
        if (!canDeleteStaff) return;
        if (!staffId || typeof staffId === "object") {
            console.error("Invalid staff ID:", staffId);
            return;
        }
        const result = await Swal.fire({
            title: "Delete Staff?",
            text: "This staff member will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel",
        });
        if (!result.isConfirmed) {
            return;
        }
        try {
            const response = await apimethods.deleteApi(
                `/deleteStaff/${staffId}`
            );
            console.log("Staff deleted successfully:", response);
            setStaffList((prev) =>
                prev.filter((staff) => {
                    const currentId =
                        staff._id ||
                        staff.id ||
                        staff.staffId;

                    return currentId !== staffId;
                })
            );
            await Swal.fire({
                title: "Deleted!",
                text: "Staff has been deleted successfully.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Failed to delete staff:", error);

            Swal.fire({
                title: "Failed to Delete Staff",
                text:
                    error?.response?.data?.message ||
                    "Something went wrong",
                icon: "error",
            });
        }
    };
    const handleAddStaff = () => {
        setSelectedStaff(null);
        setShowForm(true);
    };
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };
    const handleClearFilters = () => {
        setSearch("");
        setFilters({ role: "all" });
    };
    const filteredStaffList = useMemo(() => {
        return staffList.filter((staff) => {
            const term = search.trim().toLowerCase();
            const matchesSearch =
                !term ||
                staff?.name?.toLowerCase().includes(term) ||
                staff?.email?.toLowerCase().includes(term);

            const matchesRole =
                !filters.role ||
                filters.role === "all" ||
                staff?.role?.toLowerCase() === filters.role;

            return matchesSearch && matchesRole;
        });
    }, [staffList, search, filters]);
    return (
        <>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-semibold text-[#333] sm:text-[22px]">
                    Staff
                </h1>

                <button
                    onClick={handleAddStaff}
                    className="h-[36px] w-full rounded-[6px] bg-[#00491B] px-4 text-[12px] font-semibold text-white transition hover:bg-[#019D3E] sm:w-auto"
                >
                    Add Staff
                </button>
            </div>

            {showForm ? (
                <AddEditStaff
                    setShowForm={setShowForm}
                    setStaffList={setStaffList}
                    editStaff={selectedStaff}
                />
            ) : (
                <>
                    <SearchFilter
                        searchValue={search}
                        onSearchChange={setSearch}
                        searchPlaceholder="Search staff..."
                        filters={[
                            {
                                key: "role",
                                label: "All Roles",
                                options: [
                                    { value: "admin", label: "Admin" },
                                    { value: "staff", label: "Staff" },
                                ],
                            },
                        ]}
                        filterValues={filters}
                        onFilterChange={handleFilterChange}
                        onClear={handleClearFilters}
                    />

                    <Table
                        columns={columns}
                        data={filteredStaffList}
                        emptyMessage="No staff found"
                        onView={handleViewStaff}
                        onEdit={handleEditStaff}
                        onDelete={handleDeleteStaff}
                        canEdit={canEditStaff}
                        canDelete={canDeleteStaff}
                    />
                </>
            )}
        </>
    );
};

export default Staff;