import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";

import { toast } from "react-toastify";

import ProductGallery from "../components/product/ProductGallery";

import ProductInfo from "../components/product/ProductInfo";

import RelatedProducts from "../components/product/RelatedProducts";

import ReviewList from "../components/review/ReviewList";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review States
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);

  // Fetch Product
  const fetchProduct = async () => {
    try {
      const { data } = await axiosInstance.get(`/product/${id}`);

      if (data.success) {
        setProduct(data.product);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load product.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Reviews
  const fetchReviews = async () => {
    try {
      setReviewLoading(true);

      const { data } = await axiosInstance.get(`/reviews/${id}`);

      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load reviews.");
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    // Scroll to top when product changes
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    fetchProduct();
    fetchReviews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-2xl font-semibold">Loading Product...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-2xl font-semibold text-red-500">
          Product Not Found
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-5 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="text-gray-500 hover:text-[#6D4AFF] transition">
          Home
        </Link>

        <span className="text-gray-400">›</span>

        <Link
          to="/shop"
          className="text-gray-500 hover:text-[#6D4AFF] transition"
        >
          Shop
        </Link>

        <span className="text-gray-400">›</span>

        <span className="text-gray-500">{product.category}</span>

        <span className="text-gray-400">›</span>

        <span className="text-[#1F1F2E] font-medium truncate">
          {product.name}
        </span>
      </div>

      {/* Product */}
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
        <ProductGallery product={product} />

        <ProductInfo product={product} />
      </div>

      {/* Reviews */}
      <div className="mt-10 lg:mt-16">
        <ReviewList
          reviews={reviews}
          loading={reviewLoading}
          fetchReviews={fetchReviews}
        />
      </div>

      {/* Related Products */}
      <div className="mt-10 lg:mt-16">
        <RelatedProducts
          category={product.category}
          currentProductId={product._id}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
