const express = require("express");
const Publicrouter = express.Router();
const { registerAdmin, loginAdmin, getPublicContactDetails } = require("../../../Controller/Admin/script");
Publicrouter.post("/register", registerAdmin);
Publicrouter.post("/login", loginAdmin);
Publicrouter.get("/contact-details", getPublicContactDetails);
module.exports = Publicrouter
