import { useEffect, useState } from "react";

import { useNavigate, useParams, Link } from "react-router-dom";

import axiosInstance from "../../api/axiosInstance";

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
  FiSave,
} from "react-icons/fi";

import { toast } from "react-toastify";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    brand: "",
    category: "",
    stock: "",
    rating: "",
    reviews: "",
    featured: false,
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Fetch Product
  const fetchProduct = async () => {
    try {
      const { data } = await axiosInstance.get(`/product/${id}`);

      const product = data.product;

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price ?? "",
        oldPrice: product.oldPrice ?? "",
        brand: product.brand || "",
        category: product.category || "",
        stock: product.stock ?? "",
        rating: product.rating ?? "",
        reviews: product.reviews ?? "",
        featured: product.featured || false,
      });

      setCurrentImage(product.image || "");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to load product");
    } finally {
      setFetchLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle new image
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (!selectedImage) return;

    setImage(selectedImage);
  };

  // Submit Product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const productData = new FormData();

      productData.append("name", formData.name);
      productData.append("description", formData.description);
      productData.append("price", formData.price);
      productData.append("oldPrice", formData.oldPrice);
      productData.append("brand", formData.brand);
      productData.append("category", formData.category);
      productData.append("stock", formData.stock);
      productData.append("rating", formData.rating);
      productData.append("reviews", formData.reviews);
      productData.append("featured", formData.featured);

      // Only send image if a new image was selected
      if (image) {
        productData.append("image", image);
      }

      const { data } = await axiosInstance.put(`/product/${id}`, productData);

      toast.success(data.message);

      navigate("/admin/products");
    } catch (error) {
      console.log(error.response?.data);
      console.log(error);

      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to update product",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-11 border border-gray-200 rounded-lg px-3 text-sm text-gray-700 outline-none transition focus:border-[#6D4AFF] focus:ring-2 focus:ring-purple-100 placeholder:text-gray-400";

  const labelClass =
    "flex items-center gap-2 text-xs font-semibold text-[#111936] mb-2";

  // Loading Product
  if (fetchLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#6D4AFF]/20 border-t-[#6D4AFF] rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-500 font-medium">Loading Product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#111936]">Edit Product</h1>

          <p className="text-sm text-gray-500 mt-1">
            Update the details of your product
          </p>
        </div>

        {/* Back Button */}
        <Link
          to="/admin/products"
          className="
            self-start
            flex
            items-center
            gap-2
            px-4
            py-2
            rounded-lg
            border
            border-gray-200
            bg-white
            text-xs
            font-medium
            text-gray-600
            hover:border-[#6D4AFF]
            hover:text-[#6D4AFF]
            transition
          "
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
              className="
                w-full
                border
                border-gray-200
                rounded-lg
                px-3
                py-3
                text-sm
                text-gray-700
                outline-none
                resize-none
                transition
                focus:border-[#6D4AFF]
                focus:ring-2
                focus:ring-purple-100
                placeholder:text-gray-400
              "
              required
            />
          </div>

          {/* Price + Old Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price */}
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

            {/* Old Price */}
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
              Brand
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
            {/* Stock */}
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

            {/* Rating */}
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

            {/* Reviews */}
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

          {/* Current Image */}
          {currentImage && (
            <div>
              <label className={labelClass}>
                <FiUploadCloud className="text-[#6D4AFF]" size={13} />
                Current Product Image
              </label>

              <div className="w-full border border-gray-200 rounded-xl bg-[#FBFAFF] p-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-32 h-32 rounded-xl bg-white border border-gray-200 overflow-hidden flex items-center justify-center">
                    <img
                      src={currentImage}
                      alt={formData.name || "Product"}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  <div className="text-center sm:text-left">
                    <p className="text-xs font-semibold text-[#111936]">
                      Current Image
                    </p>

                    <p className="text-[11px] text-gray-400 mt-1">
                      Upload a new image below if you want to replace this one.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload New Image */}
          <div>
            <label className={labelClass}>
              <FiUploadCloud className="text-[#6D4AFF]" size={13} />
              Replace Product Image
            </label>

            <label
              htmlFor="productImage"
              className="
                flex
                flex-col
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
                Click to upload a new image
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
              onChange={handleImageChange}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {/* Cancel */}
            <Link
              to="/admin/products"
              className="
                flex
                items-center
                justify-center
                gap-2
                px-6
                py-3
                rounded-lg
                border
                border-gray-200
                bg-white
                text-gray-600
                text-xs
                font-semibold
                hover:border-gray-300
                hover:bg-gray-50
                transition
              "
            >
              <FiArrowLeft size={14} />
              Cancel
            </Link>

            {/* Update */}
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
                flex-1
                sm:flex-none
              "
            >
              <FiSave size={14} />

              {loading ? "Updating Product..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
