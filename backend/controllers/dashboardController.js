import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const revenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue = revenue.length > 0 ? revenue[0].totalRevenue : 0;
    return res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard summary",
      error: error.message,
    });
  }
};