const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../../Controller/Product/script");
const upload = require("../../Middleware/upload/script")
router.post("/create",upload.single("image"), createProduct);
router.get("/all", getAllProducts);
router.get("/getProduct/:id", getProductById);
router.put("/updateProduct/:id", upload.single("image"), updateProduct);
router.delete("deleteProduct/:id", deleteProduct);
module.exports = router;
