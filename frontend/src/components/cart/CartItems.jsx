import { useState } from "react";

import { Link } from "react-router-dom";

import { Minus, Plus, Trash2 } from "lucide-react";

import axiosInstance from "../../api/axiosInstance";

import { toast } from "react-toastify";

import { useCart } from "../../context/CartContext";

const CartItems = ({ cartItems }) => {
  const { setCartItems, fetchCart } = useCart();

  const [updatingItems, setUpdatingItems] = useState({});

  // Indian Rupee formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  // Discount calculation
  const getDiscount = (product) => {
    if (!product?.oldPrice || product.oldPrice <= 0) {
      return 0;
    }

    return Math.round(
      ((product.oldPrice - product.price) / product.oldPrice) * 100,
    );
  };

  // Increase / Decrease Quantity
  const updateQuantity = async (id, change) => {
    const currentItem = cartItems.find((item) => item._id === id);

    if (!currentItem || !currentItem.product) return;

    // Calculate exact new quantity
    const newQuantity = currentItem.quantity + change;

    // Minimum quantity
    if (newQuantity < 1) return;

    // Prevent multiple requests for same item
    if (updatingItems[id]) return;

    // Check stock before increasing
    if (change > 0 && newQuantity > currentItem.product.stock) {
      toast.warning(
        `Only ${currentItem.product.stock} items available in stock.`,
      );
      return;
    }

    // Save previous state for rollback
    const previousCartItems = [...cartItems];

    // Optimistic UI update
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item,
      ),
    );

    // Mark item as updating
    setUpdatingItems((prev) => ({
      ...prev,
      [id]: true,
    }));

    try {
      const { data } = await axiosInstance.put(`/cart/${id}`, {
        quantity: newQuantity,
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to update cart.");
      }
    } catch (error) {
      // Restore previous state if backend update fails
      setCartItems(previousCartItems);

      toast.error(error.response?.data?.message || "Failed to update cart.");
    } finally {
      setUpdatingItems((prev) => ({
        ...prev,
        [id]: false,
      }));
    }
  };

  // Remove Item
  const removeItem = async (id) => {
    if (updatingItems[id]) return;

    const confirmDelete = window.confirm("Remove this item from cart?");

    if (!confirmDelete) return;

    const previousCartItems = [...cartItems];

    // Optimistic UI update
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));

    setUpdatingItems((prev) => ({
      ...prev,
      [id]: true,
    }));

    try {
      const { data } = await axiosInstance.delete(`/cart/${id}`);

      if (!data.success) {
        throw new Error(data.message || "Failed to remove item.");
      }

      toast.success("Item removed from cart.");

      // Refresh cart because removing the last item
      // may need to show empty cart screen.
      await fetchCart();
    } catch (error) {
      // Restore previous cart
      setCartItems(previousCartItems);

      toast.error(error.response?.data?.message || "Failed to remove item.");
    } finally {
      setUpdatingItems((prev) => ({
        ...prev,
        [id]: false,
      }));
    }
  };

  // Remove invalid/null products safely
  const validCartItems = cartItems.filter((item) => item && item.product);

  return (
    <div className="space-y-4">
      {validCartItems.map((item) => {
        const product = item.product;
        const discount = getDiscount(product);

        return (
          <div
            key={item._id}
            className="
              bg-white
              border
              border-gray-100
              rounded-2xl
              shadow-sm
              hover:shadow-md
              transition
              p-4
              sm:p-5
            "
          >
            {/* ================= DESKTOP / TABLET ================= */}
            <div
              className="
                hidden
                md:grid
                md:grid-cols-[220px_minmax(0,1fr)_170px_120px]
                lg:grid-cols-[230px_minmax(0,1fr)_180px_130px]
                gap-5
                items-center
              "
            >
              {/* Product Image */}
              <Link
                to={`/product/${product._id}`}
                className="
                  relative
                  block
                  w-full
                  h-[150px]
                  lg:h-[160px]
                  bg-[#F8F8FC]
                  rounded-xl
                  overflow-hidden
                  group
                "
              >
                {discount > 0 && (
                  <span
                    className="
                      absolute
                      top-2
                      left-2
                      z-10
                      bg-[#6D4AFF]
                      text-white
                      text-[11px]
                      font-bold
                      px-2.5
                      py-1
                      rounded-full
                    "
                  >
                    {discount}% OFF
                  </span>
                )}

                <img
                  src={product.image}
                  alt={product.name}
                  className="
                    w-full
                    h-full
                    object-cover
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                />
              </Link>

              {/* Product Details */}
              <div className="min-w-0">
                <Link to={`/product/${product._id}`}>
                  <h2
                    className="
                      text-lg
                      lg:text-xl
                      font-semibold
                      text-[#1F1F2E]
                      line-clamp-2
                      hover:text-[#6D4AFF]
                      transition
                    "
                  >
                    {product.name}
                  </h2>
                </Link>

                <p className="text-sm text-gray-500 mt-1.5">
                  {product.category}
                </p>

                {/* Stock */}
                {product.stock > 0 ? (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs sm:text-sm text-green-600 font-medium">
                      In Stock
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-xs sm:text-sm text-red-500 font-medium">
                      Out of Stock
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="text-lg lg:text-xl font-bold text-[#6D4AFF]">
                    {formatCurrency(product.price)}
                  </span>

                  {product.oldPrice > 0 && (
                    <span className="text-xs lg:text-sm text-gray-400 line-through">
                      {formatCurrency(product.oldPrice)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  Stock available: {product.stock}
                </p>
              </div>

              {/* Quantity */}
              <div className="flex justify-center">
                <div
                  className="
                    flex
                    items-center
                    border
                    border-gray-200
                    rounded-xl
                    overflow-hidden
                  "
                >
                  <button
                    onClick={() => updateQuantity(item._id, -1)}
                    disabled={item.quantity <= 1 || updatingItems[item._id]}
                    className="
                      w-11
                      h-11
                      flex
                      items-center
                      justify-center
                      text-gray-700
                      hover:bg-gray-100
                      transition
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                      cursor-pointer
                    "
                  >
                    <Minus size={17} />
                  </button>

                  <div
                    className="
                      w-11
                      h-11
                      border-x
                      border-gray-200
                      flex
                      items-center
                      justify-center
                      font-semibold
                      text-[#1F1F2E]
                    "
                  >
                    {item.quantity}
                  </div>

                  <button
                    onClick={() => updateQuantity(item._id, 1)}
                    disabled={
                      updatingItems[item._id] || item.quantity >= product.stock
                    }
                    className="
                      w-11
                      h-11
                      flex
                      items-center
                      justify-center
                      text-[#6D4AFF]
                      hover:bg-[#F5F2FF]
                      transition
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                      cursor-pointer
                    "
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Total + Remove */}
              <div className="flex flex-col items-end gap-4">
                <span className="font-bold text-lg text-[#1F1F2E]">
                  {formatCurrency(product.price * item.quantity)}
                </span>

                <button
                  onClick={() => removeItem(item._id)}
                  disabled={updatingItems[item._id]}
                  className="
                    flex
                    items-center
                    gap-2
                    text-red-500
                    hover:text-red-600
                    text-sm
                    font-semibold
                    transition
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    cursor-pointer
                  "
                >
                  <Trash2 size={17} />
                  Remove
                </button>
              </div>
            </div>

            {/* ================= MOBILE ================= */}
            <div className="md:hidden">
              {/* Top: Image + Details */}
              <div className="flex gap-4">
                {/* Product Image */}
                <Link
                  to={`/product/${product._id}`}
                  className="
                    relative
                    shrink-0
                    w-[120px]
                    h-[130px]
                    sm:w-[145px]
                    sm:h-[145px]
                    bg-[#F8F8FC]
                    rounded-xl
                    overflow-hidden
                    group
                  "
                >
                  {discount > 0 && (
                    <span
                      className="
                        absolute
                        top-2
                        left-2
                        z-10
                        bg-[#6D4AFF]
                        text-white
                        text-[10px]
                        font-bold
                        px-2
                        py-1
                        rounded-full
                      "
                    >
                      {discount}% OFF
                    </span>
                  )}

                  <img
                    src={product.image}
                    alt={product.name}
                    className="
                      w-full
                      h-full
                      object-cover
                      transition-transform
                      duration-300
                      group-hover:scale-105
                    "
                  />
                </Link>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${product._id}`}>
                    <h2
                      className="
                        text-base
                        sm:text-lg
                        font-semibold
                        leading-snug
                        text-[#1F1F2E]
                        line-clamp-3
                        hover:text-[#6D4AFF]
                        transition
                      "
                    >
                      {product.name}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {product.category}
                  </p>

                  {/* Stock */}
                  {product.stock > 0 ? (
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs sm:text-sm text-green-600 font-medium">
                        In Stock
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-xs sm:text-sm text-red-500 font-medium">
                        Out of Stock
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-lg sm:text-xl font-bold text-[#6D4AFF]">
                      {formatCurrency(product.price)}
                    </span>

                    {product.oldPrice > 0 && (
                      <span className="text-xs sm:text-sm text-gray-400 line-through">
                        {formatCurrency(product.oldPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Mobile Row */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between gap-3">
                  {/* Quantity */}
                  <div
                    className="
                      flex
                      items-center
                      border
                      border-gray-200
                      rounded-xl
                      overflow-hidden
                    "
                  >
                    <button
                      onClick={() => updateQuantity(item._id, -1)}
                      disabled={item.quantity <= 1 || updatingItems[item._id]}
                      className="
                        w-10
                        h-10
                        flex
                        items-center
                        justify-center
                        hover:bg-gray-100
                        transition
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                        cursor-pointer
                      "
                    >
                      <Minus size={16} />
                    </button>

                    <div
                      className="
                        w-10
                        h-10
                        border-x
                        border-gray-200
                        flex
                        items-center
                        justify-center
                        font-semibold
                        text-sm
                      "
                    >
                      {item.quantity}
                    </div>

                    <button
                      onClick={() => updateQuantity(item._id, 1)}
                      disabled={
                        updatingItems[item._id] ||
                        item.quantity >= product.stock
                      }
                      className="
                        w-10
                        h-10
                        flex
                        items-center
                        justify-center
                        text-[#6D4AFF]
                        hover:bg-[#F5F2FF]
                        transition
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                        cursor-pointer
                      "
                    >
                      <Plus size={17} />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-[11px] text-gray-400">Item Total</p>

                    <p className="font-bold text-base sm:text-lg text-[#1F1F2E]">
                      {formatCurrency(product.price * item.quantity)}
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item._id)}
                    disabled={updatingItems[item._id]}
                    aria-label="Remove item"
                    className="
                      shrink-0
                      w-10
                      h-10
                      rounded-xl
                      border
                      border-red-200
                      text-red-500
                      flex
                      items-center
                      justify-center
                      hover:bg-red-50
                      transition
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                      cursor-pointer
                    "
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                {/* Stock available */}
                <p className="text-xs text-gray-400 mt-3">
                  Stock available: {product.stock}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartItems;
