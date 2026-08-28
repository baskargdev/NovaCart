import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../api/axiosInstance";
import ProductCard from "../shop/ProductCard";
import { toast } from "react-toastify";

const RelatedProducts = ({ category, currentProductId }) => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const fetchRelatedProducts = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/product?category=${encodeURIComponent(category)}&limit=6`,
      );

      if (data.success) {
        const filteredProducts = data.products.filter(
          (product) => product._id !== currentProductId,
        );

        setProducts(filteredProducts.slice(0, 5));
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Failed to load related products.",
      );
    }
  };

  useEffect(() => {
    if (category) {
      fetchRelatedProducts();
    }
  }, [category, currentProductId]);

  if (products.length === 0) {
    return null;
  }

  const handleViewAll = () => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="mt-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1F1F2E]">
          You May Also Like
        </h2>

        <button
          type="button"
          onClick={handleViewAll}
          className="
            shrink-0
            text-[#6D4AFF]
            font-semibold
            text-sm
            sm:text-base
            hover:text-[#5936F7]
            transition
            cursor-pointer
            flex
            items-center
            gap-1
          "
        >
          View All
          <span>→</span>
        </button>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 md:gap-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
