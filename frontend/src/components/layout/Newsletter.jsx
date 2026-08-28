import visa from "../../assets/payments/visa.png";
import mastercard from "../../assets/payments/mastercard.png";
import paytm from "../../assets/payments/paytm.png";
import upi from "../../assets/payments/upi.png";

const Newsletter = () => {
  return (
    <div className="pb-0">
      <h3 className="mb-5 text-lg font-semibold text-[#1F1F2E]">Newsletter</h3>

      <p className="mb-5 text-gray-500">
        Subscribe to receive updates on new arrivals, exclusive offers and
        discounts.
      </p>

      <div className="flex overflow-hidden rounded-xl border border-gray-200">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-3 outline-none"
        />

        <button className="bg-[#6D4AFF] px-5 text-white hover:bg-[#5b3ef7] transition">
          Subscribe
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <img src={visa} alt="Visa" className="h-8" />
        <img src={mastercard} alt="Mastercard" className="h-8" />
        <img src={paytm} alt="Paytm" className="h-8" />
        <img src={upi} alt="UPI" className="h-8" />
      </div>
    </div>
  );
};

export default Newsletter;
