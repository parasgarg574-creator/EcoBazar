import React, { useEffect, useState } from "react";
import apimethods from "../../Methods/ApiClient";
import Swal from "sweetalert2";

const initialFormData = {
    name: "",
    email: "",
    password: "",
    role: "",
    permissions: [],
};
const permissionsList = [
    {
        key: "readDashboard",
        label: "View Dashboard",
    },
    {
        key: "readProducts",
        label: "View Products",
    },
    {
        key: "createProducts",
        label: "Create Products",
    },
    {
        key: "updateProducts",
        label: "Edit Products",
    },
    {
        key: "deleteProducts",
        label: "Delete Products",
    },
    {
        key: "readStaff",
        label: "View Staff",
    },
    {
        key: "createStaff",
        label: "Create Staff",
    },
    {
        key: "updateStaff",
        label: "Edit Staff",
    },
    {
        key: "deleteStaff",
        label: "Delete Staff",
    },
    {
        key: "readOrders",
        label: "View Orders",
    },
    {
        key: "updateOrders",
        label: "Update Orders",
    },
    {
        key: "readCustomers",
        label: "View Customers",
    },
    {
        key: "readCategories",
        label: "View Categories",
    },
    {
        key: "createCategories",
        label: "Create Categories",
    },
    {
        key: "updateCategories",
        label: "Edit Categories",
    },
    {
        key: "deleteCategories",
        label: "Delete Categories", 
    },
    {
        key: "readSettings",
        label: "View Settings",
    },
];
const allPermissionKeys = permissionsList.map(
    (permission) => permission.key
);
const AddEdit = ({
    setShowForm,
    setStaffList,
    editStaff = null,
}) => {
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);

    const isEditMode = Boolean(editStaff);
    useEffect(() => {
        if (editStaff) {
            setFormData({
                name: editStaff.name || "",
                email: editStaff.email || "",
                password: "",
                role: editStaff.role || "",
                permissions: Array.isArray(editStaff.permissions)
                    ? editStaff.permissions
                    : [],
            });
        } else {
            setFormData(initialFormData);
        }
    }, [editStaff]);
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handlePermissionChange = (permissionKey) => {
        setFormData((prev) => {
            const permissions = prev.permissions || [];
            const alreadySelected =
                permissions.includes(permissionKey);
            return {
                ...prev,
                permissions: alreadySelected
                    ? permissions.filter(
                        (permission) => permission !== permissionKey
                    )
                    : [...permissions, permissionKey],
            };
        });
    };
    const handleSelectAll = () => {
        setFormData((prev) => ({
            ...prev,
            permissions:
                prev.permissions.length === allPermissionKeys.length
                    ? []
                    : allPermissionKeys,
        }));
    };
    const handleRoleChange = (e) => {
        const role = e.target.value;
        setFormData((prev) => ({
            ...prev,
            role,
            permissions:
                role === "admin"
                    ? allPermissionKeys
                    : prev.permissions,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        try {
            let response;
            const permissions =
                formData.role === "admin"
                    ? allPermissionKeys
                    : formData.permissions;
            if (isEditMode) {
                const staffId =
                    editStaff._id ||
                    editStaff.id ||
                    editStaff.staffId;
                if (!staffId) {
                    throw new Error("Staff ID not found");
                }
                const updateData = {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    permissions,
                };
                if (formData.password.trim()) {
                    updateData.password = formData.password;
                }
                response = await apimethods.putApi(
                    `/updateStaff/${staffId}`,
                    updateData
                );
                const updatedStaff =
                    response?.data?.data ||
                    response?.data ||
                    response;
                setStaffList((prev) =>
                    prev.map((staff) => {
                        const currentId =
                            staff._id ||
                            staff.id ||
                            staff.staffId;
                        return currentId === staffId
                            ? {
                                ...staff,
                                ...updatedStaff,
                                permissions,
                            }
                            : staff;
                    })
                );
                await Swal.fire({
                    title: "Staff Updated Successfully",
                    icon: "success",
                    draggable: true,
                });
            } else {
                response = await apimethods.postApi(
                    "/createStaff",
                    {
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        role: formData.role,
                        permissions,
                    }
                );
                const newStaff =
                    response?.data?.data ||
                    response?.data ||
                    response;

                setStaffList((prev) => [
                    ...prev,
                    {
                        ...newStaff,
                        permissions,
                    },
                ]);
                await Swal.fire({
                    title: "Staff Added Successfully",
                    icon: "success",
                    draggable: true,
                });
            }
            setFormData(initialFormData);
            setShowForm(false);
        } catch (error) {
            console.error(
                isEditMode
                    ? "Failed to update staff:"
                    : "Failed to add staff:",
                error
            );
            Swal.fire({
                title: isEditMode
                    ? "Failed to Update Staff"
                    : "Failed to Add Staff",
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
        <div className="rounded-2xl border border-green-100 bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-green-700">
                    {isEditMode ? "Edit Staff" : "Add Staff"}
                </h2>

                <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-xl text-gray-500 hover:text-red-500"
                >
                    ✕
                </button>
            </div>

            <form onSubmit={handleSubmit} className="w-full">
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
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
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={
                                isEditMode
                                    ? "Leave blank to keep password"
                                    : "Enter password"
                            }
                            required={!isEditMode}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="role"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Role
                        </label>

                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleRoleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                        >
                            <option value="">
                                Select Role
                            </option>

                            <option value="admin">
                                Admin
                            </option>

                            <option value="staff">
                                Staff
                            </option>
                        </select>
                    </div>
                </div>
                <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                Permissions
                            </h3>
                            <p className="text-sm text-gray-500">
                                Select the permissions for this staff member.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleSelectAll}
                            className="rounded-lg border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                        >
                            {formData.permissions.length ===
                                allPermissionKeys.length
                                ? "Unselect All"
                                : "Select All"}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {permissionsList.map((permission) => {
                            const checked =
                                formData.permissions.includes(
                                    permission.key
                                );
                            return (
                                <label
                                    key={permission.key}
                                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition hover:border-green-400 hover:bg-green-50"
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        disabled={
                                            formData.role === "admin"
                                        }
                                        onChange={() =>
                                            handlePermissionChange(
                                                permission.key
                                            )
                                        }
                                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />

                                    <span className="text-sm font-medium text-gray-700">
                                        {permission.label}
                                    </span>
                                </label>
                            );
                        })}
                    </div>

                    {formData.role === "admin" && (
                        <p className="mt-4 text-sm font-medium text-green-700">
                            Admin automatically has all permissions.
                        </p>
                    )}
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="rounded-lg border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Saving..."
                            : isEditMode
                                ? "Update"
                                : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddEdit;
