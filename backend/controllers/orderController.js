import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const placeOrder = async (req, res) => {
  try {
    const cartItems = await Cart.find({
      user: req.user.id,
    }).populate("product");

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Your cart is empty. Please add products before placing an order.",
      });
    }

    for (const item of cartItems) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          success: false,
          message: `${item.product.name} is out of stock`,
        });
      }
    }

    const totalAmount = cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    const orderItems = cartItems.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.image,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const {
      shippingAddress,
      paymentMethod,
      paymentId,
      razorpayOrderId,
      paymentStatus,
    } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,

      paymentMethod: paymentMethod || "Cash on Delivery",

      paymentStatus:
        paymentStatus || (paymentMethod === "Razorpay" ? "Paid" : "Pending"),

      paymentId: paymentId || null,

      razorpayOrderId: razorpayOrderId || null,
    });

    for (const item of cartItems) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }
    await Cart.deleteMany({
      user: req.user.id,
    });
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    }).sort({ createdAt: -1 }); // To show the newest orders first, createdAt: -1 → Descending order.

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get order details",
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get order details",
      error: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    //Get Order ID
    const { id } = req.params;

    //Find Order + Check Owner
    const order = await Order.findOne({
      _id: id,
      user: req.user.id,
    });

    //Order Exists?
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    //Already Cancelled?
    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled",
      });
    }

    //Shipped/Delivered?
    if (order.orderStatus === "Shipped" || order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled",
      });
    }

    //Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: item.quantity,
        },
      });
    }

    //If payment = Paid
    if (order.paymentStatus === "Paid") {
      order.paymentStatus = "Refunded";
    }
    order.orderStatus = "Cancelled";
    await order.save();
    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
}  