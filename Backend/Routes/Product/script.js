const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../../Controller/Product/script");
const upload = require("../../Middleware/upload/script");
const { authMiddleware, isAdmin } = require("../../Middleware/AuthMiddleware/script");

router.post("/create", authMiddleware, isAdmin, upload.single("image"), createProduct);
router.get("/all", getAllProducts);
router.get("/getProduct/:id", getProductById);
router.put("/updateProduct/:id", authMiddleware, isAdmin, upload.single("image"), updateProduct);
router.delete("/deleteProduct/:id", authMiddleware, isAdmin, deleteProduct);
module.exports = router;
