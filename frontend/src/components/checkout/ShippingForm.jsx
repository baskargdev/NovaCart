import { useEffect, useState } from "react";

import {
  MapPin,
  User,
  Phone,
  Home,
  Building2,
  Map,
  ShieldCheck,
  Globe,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";

import { toast } from "react-toastify";

const ShippingForm = ({ shippingAddress, setShippingAddress }) => {
  const [savedAddressLoading, setSavedAddressLoading] = useState(false);
  const [hasSavedAddress, setHasSavedAddress] = useState(false);

  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleUseSavedAddress = async () => {
    setSavedAddressLoading(true);

    try {
      const { data } = await axiosInstance.get("/user/profile");

      if (data.success) {
        const savedAddress = data.user?.address;

        if (!savedAddress) {
          toast.info("No saved address found. Please add one from My Account.");
          return;
        }

        const hasAddress =
          savedAddress.fullName ||
          savedAddress.phone ||
          savedAddress.street ||
          savedAddress.city ||
          savedAddress.state ||
          savedAddress.pincode ||
          savedAddress.country;

        if (!hasAddress) {
          toast.info("No saved address found. Please add one from My Account.");
          return;
        }

        setShippingAddress({
          fullName: savedAddress.fullName || "",
          phone: savedAddress.phone || "",
          address: savedAddress.street || "",
          city: savedAddress.city || "",
          state: savedAddress.state || "",
          pincode: savedAddress.pincode || "",
          country: savedAddress.country || "",
        });

        setHasSavedAddress(true);

        toast.success("Saved address applied successfully");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load saved address",
      );
    } finally {
      setSavedAddressLoading(false);
    }
  };

  const inputClass =
    "w-full h-13 border border-gray-200 rounded-xl pl-11 pr-4 text-sm sm:text-base text-[#1F1F2E] placeholder:text-gray-400 outline-none transition focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/10";

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 sm:p-6 lg:p-7">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-[#F0ECFF] flex items-center justify-center shrink-0">
            <MapPin size={25} className="text-[#6D4AFF]" />
          </div>

          {/* Title */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F2E]">
              Shipping Address
            </h2>

            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Enter your delivery details
            </p>
          </div>
        </div>

        {/* Saved Address */}
        <button
          type="button"
          onClick={handleUseSavedAddress}
          disabled={savedAddressLoading}
          className="
            w-full
            sm:w-auto
            border
            border-[#6D4AFF]
            text-[#6D4AFF]
            px-4
            py-2.5
            rounded-xl
            font-semibold
            text-sm
            flex
            items-center
            justify-center
            gap-2
            hover:bg-[#F0ECFF]
            transition
            cursor-pointer
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >
          <MapPin size={17} />

          {savedAddressLoading
            ? "Loading..."
            : hasSavedAddress
              ? "Saved Address Applied"
              : "Use Saved Address"}
        </button>
      </div>

      {/* ================= FORM ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-[#1F1F2E]">
            Full Name
          </label>

          <div className="relative">
            <User
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              name="fullName"
              value={shippingAddress.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={inputClass}
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-[#1F1F2E]">
            Phone Number
          </label>

          <div className="relative">
            <Phone
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              name="phone"
              value={shippingAddress.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className={inputClass}
            />
          </div>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block mb-2 text-sm font-semibold text-[#1F1F2E]">
            Address
          </label>

          <div className="relative">
            <Home size={19} className="absolute left-4 top-4 text-gray-400" />

            <textarea
              name="address"
              rows="3"
              value={shippingAddress.address}
              onChange={handleChange}
              placeholder="Enter street address, apartment, suite, etc."
              className="
                w-full
                min-h-[110px]
                border
                border-gray-200
                rounded-xl
                pl-11
                pr-4
                py-3.5
                text-sm
                sm:text-base
                text-[#1F1F2E]
                placeholder:text-gray-400
                outline-none
                resize-none
                transition
                focus:border-[#6D4AFF]
                focus:ring-2
                focus:ring-[#6D4AFF]/10
              "
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-[#1F1F2E]">
            City
          </label>

          <div className="relative">
            <Building2
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              name="city"
              value={shippingAddress.city}
              onChange={handleChange}
              placeholder="Enter city"
              className={inputClass}
            />
          </div>
        </div>

        {/* State */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-[#1F1F2E]">
            State
          </label>

          <div className="relative">
            <Map
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              name="state"
              value={shippingAddress.state}
              onChange={handleChange}
              placeholder="Enter state"
              className={inputClass}
            />
          </div>
        </div>

        {/* Pincode */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-[#1F1F2E]">
            Pincode
          </label>

          <div className="relative">
            <ShieldCheck
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              name="pincode"
              value={shippingAddress.pincode}
              onChange={handleChange}
              placeholder="Enter pincode"
              className={inputClass}
            />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-[#1F1F2E]">
            Country
          </label>

          <div className="relative">
            <Globe
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              name="country"
              value={shippingAddress.country}
              onChange={handleChange}
              placeholder="Enter country"
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;
