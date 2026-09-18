const express = require("express");
const router = express.Router();
const Content = require("../../Controller/Content/script");
const { authMiddleware, isAdmin } = require("../../Middleware/AuthMiddleware/script");
router.get("/getPublishedContent/:page", Content.getPublishedContentByPage);
router.get("/getAllContent", authMiddleware, Content.getAllContent);
router.get("/getContentByPage/:page", authMiddleware, Content.getContentByPage);
router.put("/updateContent/:page", authMiddleware, isAdmin, Content.updateContentByPage);
module.exports = router;
