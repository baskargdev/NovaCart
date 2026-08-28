import { FiTruck, FiRefreshCw, FiShield, FiHeadphones } from "react-icons/fi";

const features = [
  {
    icon: <FiTruck />,
    title: "Free Delivery",
    subtitle: "On orders above ₹499",
  },
  {
    icon: <FiRefreshCw />,
    title: "Easy Returns",
    subtitle: "Within 7 days",
  },
  {
    icon: <FiShield />,
    title: "Secure Payments",
    subtitle: "100% secure payments",
  },
  {
    icon: <FiHeadphones />,
    title: "24/7 Support",
    subtitle: "We're here to help you",
  },
];

const FeatureBar = () => {
  return (
    <section className="max-w-[1800px] mx-auto px-4 lg:px-10 xl:px-12 mt-1 lg:mt-1">
      <div className="grid grid-cols-2 lg:grid-cols-4 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {features.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 p-6 ${
              index !== features.length - 1 ? "lg:border-r border-gray-200" : ""
            }`}
          >
            <div className="w-14 h-14 rounded-full bg-[#F5F1FF] flex items-center justify-center text-[#6D4AFF] text-3xl">
              {item.icon}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">{item.title}</h3>

              <p className="text-sm text-gray-500">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureBar;
