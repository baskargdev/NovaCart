import Cart from "../models/Cart.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";

// Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
  try {
    // Get logged-in user's cart
    const cartItems = await Cart.find({
      user: req.user.id,
    }).populate("product");

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    // Check stock
    for (const item of cartItems) {
      if (!item.product) {
        return res.status(400).json({
          success: false,
          message: "A product in your cart is no longer available.",
        });
      }

      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          success: false,
          message: `${item.product.name} is out of stock.`,
        });
      }
    }

    // Calculate total from database prices
    const totalAmount = cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount.",
      });
    }

    const options = {
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
      totalAmount,
    });
  } catch (error) {
    console.error("Create Razorpay Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order.",
    });
  }
};

// Verify Razorpay Payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are missing.",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed.",
    });
  }
};
