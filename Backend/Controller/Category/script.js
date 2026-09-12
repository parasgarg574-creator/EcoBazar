const { default: mongoose } = require("mongoose");
const Category = require("../../Modles/Category/script");
const Product = require("../../Modles/Product/script")
const createCategory = async (req, res) => {
    try {
        const { name, description, ispopular } = req.body;

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
            ispopular,
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
        const categories = await Category.aggregate([

            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "categoryID",
                    as: "products"
                }
            },
            {
                $project: {
                    products: 0,
                }
            }
        ])
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
      const {id} = req.params
      if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            success:false,
            message:"invalis categry id "
        })
      }
      const category  = await Category.findById(id);
      if(!category){
        return res.status(400).json({
            success:false,
            message:"category not found"
        })
      }
      const {search="",minprice,maxprie,page=1,limit=10,sort="createdAt",order="desc"} = req.query;
      const pageNumber =  Number(page);
      const limitNumber = Number(limit);
      const matchStage = {};
        if(search){
            matchStage.name = {$regex: search, $options: "i"};
        }
        if(minprice || maxprie){
            matchStage.price = {};
            if(minprice){
                matchStage.price.$gte = Number(minprice);
            }
            if(maxprie){
                matchStage.price.$lte = Number(maxprie);
            }
        }
        const sortOrder = order === "asc" ? 1 : -1;
        const products = await Product.aggregate([
            {
                $match: {
                    ...matchStage,
                    categoryID: new mongoose.Types.ObjectId(id) 
                }
            },
            {
                $sort: {
                    [sort]: sortOrder
                }
            },
            {
                $skip: (pageNumber - 1) * limitNumber
            },
            {
                $limit: limitNumber
            }
        ]);
        res.status(200).json({
            success: true,
            data: products
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
        const { name, description, ispopular } = req.body;

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        category.name = name || category.name;
        category.description =
            description !== undefined ? description : category.description;
        category.ispopular = ispopular === true || ispopular === "true"

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