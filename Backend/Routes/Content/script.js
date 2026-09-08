const express = require("express");
const router = express.Router();
const Content = require("../../Controller/Content/script");
const { authMiddleware, isAdmin } = require("../../Middleware/AuthMiddleware/script");

// Public - used by the storefront to display the legal pages to customers
router.get("/getPublishedContent/:page", Content.getPublishedContentByPage);

// Admin - view + edit only (no create/delete, only 2 fixed pages exist)
router.get("/getAllContent", authMiddleware, Content.getAllContent);
router.get("/getContentByPage/:page", authMiddleware, Content.getContentByPage);
router.put("/updateContent/:page", authMiddleware, isAdmin, Content.updateContentByPage);

module.exports = router;
