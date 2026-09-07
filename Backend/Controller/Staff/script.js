const bcrypt = require("bcrypt");
const User = require("../../Modles/User/script");
const createStaff = async (req, res) => {
    try {
        const { name, email, password, role, permissions } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Please enter name, email, password and role",
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            permissions: role === "admin" ? [] : permissions || [],
        });
        const userResponse = user.toObject();
        delete userResponse.password;
        return res.status(201).json({
            success: true,
            message: "Staff created successfully",
            data: userResponse,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getStaff = async (req, res) => {
    try {
        const staffs = await User.find().select("-password");
        return res.status(200).json({
            success: true,
            message: staffs.length
                ? "Staffs fetched successfully"
                : "No staffs available",
            data: staffs,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
const getSingleStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await User.findById(id).select("-password");

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Staff fetched successfully",
            data: staff,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role, permissions, isActive } = req.body;
        const staff = await User.findById(id);
        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found",
            });
        }
        staff.name = name || staff.name;
        staff.email = email || staff.email;
        staff.role = role || staff.role;
        if (permissions !== undefined) {
            staff.permissions = staff.role === "admin" ? [] : permissions;
        }
        if (isActive !== undefined) {
            staff.isActive = isActive;
        }
        if (password && password.trim()) {
            staff.password = await bcrypt.hash(password, 10);
        }
        await staff.save();
        const staffResponse = staff.toObject();
        delete staffResponse.password;
        return res.status(200).json({
            success: true,
            message: "Staff updated successfully",
            data: staffResponse,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await User.findById(id);
        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found",
            });
        }
        await User.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Staff deleted successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

module.exports = {
    createStaff,
    getStaff,
    getSingleStaff,
    updateStaff,
    deleteStaff,
};
