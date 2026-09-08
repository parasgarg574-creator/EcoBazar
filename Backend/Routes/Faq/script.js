const express = require("express");
const router = express.Router();
const Faq = require("../../Controller/Faq/script");
const { authMiddleware, isAdmin } = require("../../Middleware/AuthMiddleware/script");

// Public - storefront FAQ page
router.get("/getPublishedFaqs", Faq.getPublishedFaqs);

// Admin - full CRUD
router.post("/createFaq", authMiddleware, isAdmin, Faq.createFaq);
router.get("/getFaqs", authMiddleware, Faq.getFaqs);
router.get("/getSingleFaq/:id", authMiddleware, Faq.getSingleFaq);
router.put("/updateFaq/:id", authMiddleware, isAdmin, Faq.updateFaq);
router.delete("/deleteFaq/:id", authMiddleware, isAdmin, Faq.deleteFaq);

module.exports = router;
