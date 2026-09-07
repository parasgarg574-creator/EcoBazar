const express = require("express");
const Protectedrouter = express.Router();
const { getAdminProfile, updateAdmin, deleteAdmin } = require("../../../Controller/Admin/script");
const { authMiddleware } = require("../../../Middleware/AuthMiddleware/script");
Protectedrouter.get("/profile", authMiddleware, getAdminProfile);
Protectedrouter.put("/update", authMiddleware, updateAdmin);
Protectedrouter.delete("/delete", authMiddleware, deleteAdmin);
module.exports = Protectedrouter
