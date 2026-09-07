const Category = require("../../Modles/Category/script");
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }
        let imageUrl = "";
        if (req.file) {
            imageUrl = `${req.protocol}://${req.get("host")}/uploads/categories/${req.file.filename}`;
        }
        const category = await Category.create({
            name,
            description,
            image: imageUrl
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create category",
            error: error.message
        });
    }
};
const getCategory = async (req, res) => {
    try {
        const categories = await Category.find();

        res.status(200).json({
            success: true,
            data: categories
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getSingleCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        category.name = name;
        category.description = description;

        if (req.file) {
            category.image = `${req.protocol}://${req.get("host")}/uploads/categories/${req.file.filename}`;
        }

        await category.save();

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {
    createCategory,
    getCategory,
    getSingleCategory,
    updateCategory,
    deleteCategory
};