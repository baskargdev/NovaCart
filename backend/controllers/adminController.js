import Order from "../models/Order.js";

// GET ALL ORDERS - ADMIN

export const getAllOrders = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    // 12 orders per page
    const limit = Math.max(Number(req.query.limit) || 12, 1);

    const skip = (page - 1) * limit;

    // Get total orders
    const totalOrders = await Order.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalOrders / limit);

    // Get orders for current page
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      orders,
      totalOrders,
      currentPage: page,
      totalPages,
      limit,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get order details",
      error: error.message,
    });
  }
};

// UPDATE ORDER STATUS - ADMIN

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const validTransitions = {
      Pending: ["Confirmed", "Cancelled"],
      Confirmed: ["Shipped", "Cancelled"],
      Shipped: ["Delivered"],
      Delivered: [],
      Cancelled: [],
    };

    if (
      order.orderStatus === "Delivered" ||
      order.orderStatus === "Cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: "This order cannot be updated",
      });
    }

    if (!validTransitions[order.orderStatus].includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${order.orderStatus} to ${orderStatus}`,
      });
    }

    if (orderStatus === "Delivered" && order.paymentStatus === "Pending") {
      order.paymentStatus = "Paid";
    }

    order.orderStatus = orderStatus;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order details",
      error: error.message,
    });
  }
};
