const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../Middleware/AuthMiddleware/script");

const {
  createorder,
  getorder,
  getOrderById,
  updateorder,
  deleteorder,
} = require("../../Controller/Order/script");

router.post("/createorder", authMiddleware, createorder);
router.post("/order/checkout", authMiddleware, createorder);
router.get("/getorder", authMiddleware, getorder);
router.get("/getorder/:userId", authMiddleware, getorder);
router.get("/order/detail/:id", authMiddleware, getOrderById);
router.put("/updateorder/:id", authMiddleware, updateorder);
router.delete("/deleteorder/:id", authMiddleware, deleteorder);

module.exports = router;