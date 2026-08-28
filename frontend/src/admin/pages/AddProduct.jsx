import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import {
  FiUploadCloud,
  FiTag,
  FiFileText,
  FiDollarSign,
  FiLayers,
  FiBox,
  FiStar,
  FiMessageCircle,
  FiCheckSquare,
  FiArrowLeft,
  FiPlus,
} from "react-icons/fi";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    category: "",
    brand: "",
    stock: "",
    rating: "",
    reviews: "",
    featured: false,
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Submit Product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.warning("Please select a product image.");
      return;
    }

    try {
      setLoading(true);

      const productData = new FormData();

      productData.append("name", formData.name);
      productData.append("description", formData.description);
      productData.append("price", formData.price);
      productData.append("oldPrice", formData.oldPrice);
      productData.append("category", formData.category);
      productData.append("brand", formData.brand);
      productData.append("stock", formData.stock);
      productData.append("rating", formData.rating);
      productData.append("reviews", formData.reviews);
      productData.append("featured", formData.featured);
      productData.append("image", image);

      const { data } = await axiosInstance.post("/product/create", productData);

      toast.success(data.message);
      navigate("/admin/products");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-11 border border-gray-200 rounded-lg px-3 text-sm text-gray-700 outline-none transition focus:border-[#6D4AFF] focus:ring-2 focus:ring-purple-100 placeholder:text-gray-400";

  const labelClass =
    "flex items-center gap-2 text-xs font-semibold text-[#111936] mb-2";

  return (
    <div className="max-w-5xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#111936]">Add Product</h1>

          <p className="text-sm text-gray-500 mt-1">
            Fill in the details to add a new product to your store
          </p>
        </div>

        <Link
          to="/admin/products"
          className="self-start flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:border-[#6D4AFF] hover:text-[#6D4AFF] transition"
        >
          <FiArrowLeft size={13} />
          Back to Products
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className={labelClass}>
              <FiTag className="text-[#6D4AFF]" size={13} />
              Product Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>
              <FiFileText className="text-[#6D4AFF]" size={13} />
              Description
            </label>

            <textarea
              rows="4"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-700 outline-none resize-none transition focus:border-[#6D4AFF] focus:ring-2 focus:ring-purple-100 placeholder:text-gray-400"
              required
            />
          </div>

          {/* Price + Old Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                <FiDollarSign className="text-[#6D4AFF]" size={13} />
                Price
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`${inputClass} pl-9`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                <FiDollarSign className="text-[#6D4AFF]" size={13} />
                Old Price
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  name="oldPrice"
                  placeholder="Old Price"
                  value={formData.oldPrice}
                  onChange={handleChange}
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>
              <FiLayers className="text-[#6D4AFF]" size={13} />
              Select Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`${inputClass} cursor-pointer`}
              required
            >
              <option value="">Select Category</option>
              <option value="fashion">Fashion</option>
              <option value="electronics">Electronics</option>
              <option value="home">Home</option>
              <option value="beauty">Beauty</option>
              <option value="sports">Sports</option>
              <option value="toys">Toys</option>
              <option value="bags-accessories">Bags & Accessories</option>
              <option value="footwear">Footwear</option>
              <option value="books-stationery">Books & Stationery</option>
            </select>
          </div>

          {/* Brand */}
          <div>
            <label className={labelClass}>
              <FiTag className="text-[#6D4AFF]" size={13} />
              Brand (e.g. Apple, Samsung, Nike)
            </label>

            <input
              type="text"
              name="brand"
              placeholder="Brand (e.g. Apple, Samsung, Nike)"
              value={formData.brand}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Stock / Rating / Reviews */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>
                <FiBox className="text-[#6D4AFF]" size={13} />
                Stock
              </label>

              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                <FiStar className="text-[#6D4AFF]" size={13} />
                Rating
              </label>

              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                name="rating"
                placeholder="Rating"
                value={formData.rating}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <FiMessageCircle className="text-[#6D4AFF]" size={13} />
                Reviews
              </label>

              <input
                type="number"
                min="0"
                name="reviews"
                placeholder="Reviews"
                value={formData.reviews}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Featured */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 accent-[#6D4AFF] cursor-pointer"
            />

            <FiCheckSquare size={14} className="text-[#6D4AFF]" />

            <span className="text-xs font-semibold text-[#111936]">
              Featured Product
            </span>
          </label>

          {/* Product Image */}
          <div>
            <label className={labelClass}>
              <FiUploadCloud className="text-[#6D4AFF]" size={13} />
              Product Image
            </label>

            <label
              htmlFor="productImage"
              className="
                flex flex-col
                items-center
                justify-center
                w-full
                min-h-[150px]
                px-4
                py-6
                border-2
                border-dashed
                border-purple-200
                rounded-xl
                bg-[#FBFAFF]
                cursor-pointer
                hover:border-[#6D4AFF]
                hover:bg-[#F8F6FF]
                transition-all
                duration-300
              "
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <FiUploadCloud size={21} className="text-[#6D4AFF]" />
              </div>

              <p className="mt-3 text-xs font-semibold text-[#111936]">
                Click to upload product image
              </p>

              <p className="text-[10px] text-gray-400 mt-1">
                JPG, JPEG, PNG, WEBP
              </p>

              {image && (
                <p className="mt-2 text-xs text-green-600 font-medium text-center break-all">
                  Selected: {image.name}
                </p>
              )}
            </label>

            <input
              id="productImage"
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              flex
              items-center
              justify-center
              gap-2
              bg-[#6D4AFF]
              hover:bg-[#5A39F3]
              disabled:bg-gray-400
              text-white
              px-6
              py-3
              rounded-lg
              text-xs
              font-semibold
              cursor-pointer
              disabled:cursor-not-allowed
              transition
            "
          >
            <FiPlus size={14} />

            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
