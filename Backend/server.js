const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
console.log("Razorpay Key:", process.env.RAZORPAY_KEY_ID);
const cors = require("cors");
const path = require("path");
const AdminPublicRoutes = require("./Routes/Admin/Public/script");
const AdminProtectedRoutes = require("./Routes/Admin/Protected/script");
const CategoryRoutes = require("./Routes/category/script");
const StaffRoutes = require("./Routes/Staff/script");
const ProductRoutes = require("./Routes/Product/script");
const ContentRoutes = require("./Routes/Content/script");
const FaqRoutes = require("./Routes/Faq/script");
const OrderRoutes = require("./Routes/Order/script");
const UserRoutes = require("./Routes/User/script");
const ContactRoutes = require("./Routes/Contact/script");
const PaymentRoutes = require("./Routes/Payment/script")
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", AdminPublicRoutes);
app.use("/protected", AdminProtectedRoutes);
app.use("/", CategoryRoutes);
app.use("/", StaffRoutes);
app.use("/",ProductRoutes);
app.use("/",ContentRoutes);
app.use("/",FaqRoutes);
app.use("/",OrderRoutes);
app.use("/",UserRoutes);
app.use("/", ContactRoutes);
app.use("/",PaymentRoutes)
app.use(
    "/uploads",
    express.static(path.join(__dirname, "Middleware", "uploads"))
);
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running"
    });
});
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error.message
        );
        process.exit(1);
    });