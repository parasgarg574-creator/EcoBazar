const mongoose = require("mongoose");
const Orders = require("../../Modles/Order/script");
const Product = require("../../Modles/Product/script");
const validateShippingAddress = (shippingAddress) => {
  if (!shippingAddress) {
    return "Shipping address is required.";
  }
  if (typeof shippingAddress === "string") {
    if (!shippingAddress.trim()) {
      return "Shipping address cannot be empty.";
    }
    return null;
  }
  if (typeof shippingAddress === "object") {
    const { fullName, phone, address, city, state, zipCode, country } = shippingAddress;
    if (!fullName || !fullName.trim()) return "Full Name is required in shipping address.";
    if (!phone || !phone.trim()) return "Phone Number is required in shipping address.";
    if (!address || !address.trim()) return "Address is required in shipping address.";
    if (!city || !city.trim()) return "City is required in shipping address.";
    if (!state || !state.trim()) return "State/Province is required in shipping address.";
    if (!zipCode || !zipCode.trim()) return "Postal/ZIP Code is required in shipping address.";
    if (!country || !country.trim()) return "Country is required in shipping address.";
    return null;
  }
  return "Invalid shipping address format.";
};
const createorder = async (req, res) => {
  try {
    const authUserId = req.user?.id || req.user?._id;
    if (!authUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    const {
      orderItems,
      shippingAddress,
      paymentMethod = "cod",
      paymentStatus,
      razorpayOrderId,
      razorpayPaymentId,
      discountAmount = 0,
      totalAmount,
    } = req.body;

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items cannot be empty",
      });
    }

    const shippingError = validateShippingAddress(shippingAddress);
    if (shippingError) {
      return res.status(400).json({
        success: false,
        message: shippingError,
      });
    }

    let calculatedTotal = 0;
    const validatedOrderItems = [];

    for (const item of orderItems) {
      const pId = item.productId || item.product?._id || item.product;
      if (!pId || !mongoose.Types.ObjectId.isValid(pId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid product ID: ${pId}`,
        });
      }

      const productDoc = await Product.findById(pId);
      if (!productDoc) {
        return res.status(404).json({
          success: false,
          message: `Product not found for ID: ${pId}`,
        });
      }

      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      const price = Number(productDoc.price) || 0;

      calculatedTotal += price * quantity;

      validatedOrderItems.push({
        productId: productDoc._id,
        quantity,
        price,
      });
    }

    const statusOfPayment = paymentStatus || (paymentMethod === "cod" ? "pending" : "paid");

    const finalCalculatedTotal = Math.max(0, calculatedTotal - Number(discountAmount || 0));
    const finalTotalAmount = (totalAmount !== undefined && Number(totalAmount) >= 0)
      ? Number(totalAmount)
      : finalCalculatedTotal;

    const order = new Orders({
      userId: authUserId,
      orderItems: validatedOrderItems,
      totalAmount: finalTotalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: statusOfPayment,
      razorpayOrderId,
      razorpayPaymentId,
      orderStatus: "pending",
    });

    await order.save();
    
    const populatedOrder = await Orders.findById(order._id)
      .populate("userId", "name email")
      .populate("orderItems.productId", "name price image");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: populatedOrder || order,
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create order: " + (err.message || "Internal server error"),
    });
  }
};

const getorder = async (req, res) => {
  try {
    const authUserId = req.user?.id || req.user?._id;
    if (!authUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    let targetUserId = req.params.userId;
    if (!targetUserId || targetUserId === "undefined") {
      targetUserId = authUserId;
    }
    if (
      req.user.role !== "admin" &&
      targetUserId.toString() !== authUserId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only access your own orders",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }
    const orders = await Orders.find({ userId: targetUserId })
      .populate("orderItems.productId", "name price image description")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const getOrderById = async (req, res) => {
  try {
    const authUserId = req.user?.id || req.user?._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Orders.findById(id)
      .populate("userId", "name email")
      .populate("orderItems.productId", "name price image");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    if (
      req.user.role !== "admin" &&
      order.userId._id.toString() !== authUserId.toString() &&
      order.userId.toString() !== authUserId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cannot access this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateorder = async (req, res) => {
  try {
    const authUserId = req.user?.id || req.user?._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const existingOrder = await Orders.findById(id);
    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      existingOrder.userId.toString() !== authUserId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cannot update this order",
      });
    }

    const { paymentStatus, orderStatus, paymentMethod } = req.body;
    const updateData = { updatedAt: new Date() };

    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentMethod) updateData.paymentMethod = paymentMethod;

    const order = await Orders.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("orderItems.productId", "name price image");

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteorder = async (req, res) => {
  try {
    const authUserId = req.user?.id || req.user?._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const existingOrder = await Orders.findById(id);
    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      existingOrder.userId.toString() !== authUserId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cannot delete this order",
      });
    }

    await Orders.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createorder,
  getorder,
  getOrderById,
  updateorder,
  deleteorder,
};