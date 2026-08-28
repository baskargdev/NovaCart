import { Link } from "react-router-dom";
import categories from "../../data/categories";

const CategorySection = () => {
  return (
    <section className="max-w-[1800px] mx-auto px-4 lg:px-10 xl:px-12 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl lg:text-4xl font-bold text-[#1F1F2E]">
            Shop by Category
          </h2>

          <p className="text-gray-500 mt-2">Explore our top categories</p>
        </div>

        <Link
          to="/categories"
          className="hidden md:block text-[#6D4AFF] font-semibold hover:underline"
        >
          View All →
        </Link>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/shop?category=${category.slug}`}
            className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
          >
            {/* Category Image */}
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-40 object-fill transition-transform duration-500 group-hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

            {/* Category Name */}
            <div className="absolute bottom-3 left-3 text-white">
              <h3 className="text-lg font-bold">{category.name}</h3>

            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
