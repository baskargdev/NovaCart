const OrderItem = ({ item }) => {
  // Indian Rupee formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 rounded-2xl p-5 hover:shadow-md transition">
      {/* Product Image */}
      <img
        src={item.image}
        alt={item.name}
        className="w-32 h-32 object-fill bg-[#F8F8FC] rounded-2xl p-3"
      />

      {/* Product Details */}
      <div className="flex-1 w-full">
        <h3 className="text-xl font-semibold text-[#1F1F2E]">{item.name}</h3>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-600">
          {/* Price */}
          <div>
            <p className="text-sm text-gray-500">Price</p>

            <p className="font-semibold text-lg">
              {formatCurrency(item.price)}
            </p>
          </div>

          {/* Quantity */}
          <div>
            <p className="text-sm text-gray-500">Quantity</p>

            <p className="font-semibold text-lg">{item.quantity}</p>
          </div>

          {/* Subtotal */}
          <div>
            <p className="text-sm text-gray-500">Subtotal</p>

            <p className="font-bold text-lg text-[#6D4AFF]">
              {formatCurrency(Number(item.price) * item.quantity)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
