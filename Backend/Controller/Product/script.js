const mongoose = require("mongoose");
const Product = require("../../Modles/Product/script");
const createProduct = async (req, res) => {
  try {
    const { categoryID, name, price, discount, stock, description, ispopular, isfeatured } =
      req.body;
    let imageUrl = "";
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/categories/${req.file.filename}`;
    }
    const product = await Product.create({ categoryID, name, price, discount, stock, description, image: imageUrl, ispopular, isfeatured });     
    res.status(201).json({ success: true, message: "Product created successfully", data: product,
    });
  } catch (error) {                 
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getAllProducts = async (req, res) => {
  try {
    const {
      search = "",
      categoryID,
      minPrice,
      maxPrice,
      stock,
      page,
      limit,
      sort = "createdAt",
      order = "desc",
    } = req.query;
    const matchStage = {};
    if (search && search.trim()) {
      matchStage.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }
    if (categoryID && categoryID !== "all") {
      if (!mongoose.Types.ObjectId.isValid(categoryID)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      matchStage.categoryID = new mongoose.Types.ObjectId(categoryID);
    }
    if (stock === "inStock") {
      matchStage.stock = { $gt: 0 };
    } else if (stock === "outOfStock") {
      matchStage.stock = { $lte: 0 };
    }
    if (minPrice || maxPrice) {
      matchStage.price = {};

      if (minPrice) {
        matchStage.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        matchStage.price.$lte = Number(maxPrice);
      }
    }
    const sortOrder = order === "asc" ? 1 : -1;
    const pipeline = [
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryID",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
          },
      },
      {
        $sort: {
          [sort]: sortOrder,
        },
      },
    ];
    if (page !== undefined || limit !== undefined) {
      const pageNumber = Number(page) || 1;
      const limitNumber = Number(limit) || 10;

      pipeline.push(
        {
          $skip: (pageNumber - 1) * limitNumber,
        },
        {
          $limit: limitNumber,
        }
      );
    }
    pipeline.push({
      $project: {
        name: 1,
        price: 1,
        discount: 1,
        stock: 1,
        description: 1,
        image: 1,
        createdAt: 1,
        isfeatured: 1,
        ispopular: 1,
        updatedAt: 1,
        category: {
          _id: "$category._id",
          name: "$category.name",
        },
      },
    });
    const products = await Product.aggregate(pipeline);
    const totalProducts = await Product.countDocuments(matchStage);
    const response = {
      success: true,
      message: "Products fetched successfully",
      totalProducts,
      data: products,
    };
    if (page !== undefined || limit !== undefined) {
      const pageNumber = Number(page) || 1;
      const limitNumber = Number(limit) || 10;

      response.currentPage = pageNumber;
      response.totalPages = Math.ceil(totalProducts / limitNumber);
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }
    const products = await Product.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryID",
          foreignField: "_id",
          as: "category",
        },
      },

      {
        $unwind: {
          path: "$category",
        },
      },
      {
        $project: {
          name: 1,
          price: 1,
          discount: 1,
          stock: 1,
          description: 1,
          image: 1,
          createdAt: 1,
          updatedAt: 1,
          ispopular:1,
          isfeatured:1,
          category: {
            _id: "$category._id",
            name: "$category.name",
          },
        },
      },
    ]);
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: products[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `${req.protocol}://${req.get("host")}/uploads/categories/${req.file.filename}`;
    }
    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct,};
