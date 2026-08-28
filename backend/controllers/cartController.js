import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    //check if product exists
    const product = await Product.findById(productId);
     if (!product) {
       return res.status(404).json({
         success: false,
         message: "Product not found",
       });
     }
     // check if the product is already in the cart
    let cartItem = await Cart.findOne({
      user: userId,
      product: productId,
    });
    
    if (cartItem) {
      //calcculate new quantity
      const newQuantity = cartItem.quantity + quantity;
     //check before stock saving
    if (newQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock available",
      });
    }  
      //update quantity
      cartItem.quantity = newQuantity;
      await cartItem.save();

    } else {
      //check stock for new cart item
      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: "Not enough stock available",
        });
      }
      //create new cart item
      cartItem = new Cart({
        user: userId,
        product: productId,
        quantity,
      });
        await cartItem.save();
    }
    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cartItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
      error: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({
      user: req.user.id,
    })
      .populate("product")
      .select("-user");

    // Remove cart items whose product no longer exists
    const validCartItems = cartItems.filter((item) => item.product !== null);

    const invalidCartItems = cartItems.filter((item) => item.product === null);

    // Clean up stale cart items from database
    if (invalidCartItems.length > 0) {
      await Cart.deleteMany({
        _id: {
          $in: invalidCartItems.map((item) => item._id),
        },
      });
    }

    res.status(200).json({
      success: true,
      cartItems: validCartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart items",
      error: error.message,
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { id } = req.params;

    // Validate quantity
    if (!Number.isInteger(quantity)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity.",
      });
    }

    const cartItem = await Cart.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found.",
      });
    }

    const product = await Product.findById(cartItem.product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Remove item when quantity becomes 0
    if (quantity <= 0) {
      await cartItem.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Item removed from cart.",
      });
    }

    // Check available stock
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock.`,
      });
    }

    // Set the exact quantity
    cartItem.quantity = quantity;

    await cartItem.save();

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully.",
      cartItem,
    });
  } catch (error) {
    console.error("Update Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update cart items.",
    });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await Cart.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    await cartItem.deleteOne();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
      error: error.message,
    });
  }
};


