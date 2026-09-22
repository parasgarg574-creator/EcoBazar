const express = require("express");
const { submitContactMessage } = require("../../Controller/Contact/script");

const router = express.Router();
router.post("/contact-messages", submitContactMessage);

module.exports = router;