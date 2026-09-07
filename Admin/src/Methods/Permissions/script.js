const getUserPermissions = () => {
    try {
        const permissions = JSON.parse(localStorage.getItem("userPermissions"));
        return Array.isArray(permissions) ? permissions : [];
    } catch (error) {
        console.error("Invalid userPermissions:", error);
        return [];
    }
};

const getUserRole = () => {
    try {
        const response = JSON.parse(localStorage.getItem("response"));
        return response?.data?.role?.toLowerCase() || "";
    } catch (error) {
        console.error("Invalid response:", error);
        return "";
    }
};
const isAdmin = () => getUserRole() === "admin";
const isAllowed = (permissionKey) => {
    if (isAdmin()) return true;
    if (!permissionKey) return false;
    return getUserPermissions().includes(permissionKey);
};
const permissions = { getUserPermissions, getUserRole, isAdmin, isAllowed };
export default permissions;
