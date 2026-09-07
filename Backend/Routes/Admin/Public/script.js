const express = require("express");
const Publicrouter = express.Router();
const { registerAdmin, loginAdmin } = require("../../../Controller/Admin/script");
Publicrouter.post("/register", registerAdmin);
Publicrouter.post("/login", loginAdmin);
module.exports = Publicrouter
