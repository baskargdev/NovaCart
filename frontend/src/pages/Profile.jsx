import { useEffect, useState } from "react";

import axiosInstance from "../api/axiosInstance";

import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import ProfileForm from "../components/profile/ProfileForm";

import ChangePassword from "../components/profile/ChangePassword";

import {
  ShieldCheck,
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  UserRound,
  Zap,
  Package,
  LogOut,
  Phone,
  Home,
  Building2,
  Globe,
  Save,
  Pencil,
  Truck,
  RotateCcw,
  Headphones,
} from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Saved address state
  const [addressData, setAddressData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [addressEditing, setAddressEditing] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  // Account statistics
  const [ordersCount, setOrdersCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const fetchProfile = async () => {
    try {
      const { data } = await axiosInstance.get("/user/profile");

      if (data.success) {
        setUser(data.user);

        setAddressData({
          fullName: data.user.address?.fullName || "",
          phone: data.user.address?.phone || "",
          street: data.user.address?.street || "",
          city: data.user.address?.city || "",
          state: data.user.address?.state || "",
          pincode: data.user.address?.pincode || "",
          country: data.user.address?.country || "India",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    setAddressData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();

    setAddressLoading(true);

    try {
      const { data } = await axiosInstance.put("/user/profile", {
        name: user.name,
        email: user.email,
        address: addressData,
      });

      if (data.success) {
        setUser(data.user);

        setAddressData({
          fullName: data.user.address?.fullName || "",
          phone: data.user.address?.phone || "",
          street: data.user.address?.street || "",
          city: data.user.address?.city || "",
          state: data.user.address?.state || "",
          pincode: data.user.address?.pincode || "",
          country: data.user.address?.country || "India",
        });

        setAddressEditing(false);
        toast.success("Address saved successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save address");
    } finally {
      setAddressLoading(false);
    }
  };

  const hasSavedAddress = Boolean(
    user?.address?.fullName ||
    user?.address?.phone ||
    user?.address?.street ||
    user?.address?.city ||
    user?.address?.state ||
    user?.address?.pincode,
  );

  const resetAddressForm = () => {
    setAddressData({
      fullName: user?.address?.fullName || "",
      phone: user?.address?.phone || "",
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      pincode: user?.address?.pincode || "",
      country: user?.address?.country || "India",
    });
    setAddressEditing(false);
  };

  useEffect(() => {
    fetchProfile();

    const fetchAccountCounts = async () => {
      try {
        const [ordersResponse, wishlistResponse] = await Promise.allSettled([
          axiosInstance.get("/orders"),
          axiosInstance.get("/wishlist"),
        ]);

        if (ordersResponse.status === "fulfilled") {
          const data = ordersResponse.value.data;

          if (data.success) {
            setOrdersCount(Array.isArray(data.orders) ? data.orders.length : 0);
          }
        }

        if (wishlistResponse.status === "fulfilled") {
          const data = wishlistResponse.value.data;

          if (data.success) {
            const wishlistItems =
              data.wishlist || data.items || data.products || [];

            setWishlistCount(
              Array.isArray(wishlistItems) ? wishlistItems.length : 0,
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch account statistics:", error);
      }
    };

    fetchAccountCounts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#F8F9FD]">
        <div className="w-10 h-10 border-4 border-[#6D4AFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#F8F9FD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <div className="mb-7 sm:mb-9">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#111827]">
              My Account
            </h1>

            <div className="w-9 h-9 rounded-xl bg-[#F1ECFF] flex items-center justify-center">
              <ShieldCheck size={21} className="text-[#6D4AFF]" />
            </div>
          </div>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Manage your profile, settings and preferences
          </p>
        </div>

        {/* =====================================================
            PROFILE HERO
        ====================================================== */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          {/* Hero Top */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#F3EDFF] via-[#F8F3FF] to-[#EEE7FF] px-6 sm:px-8 lg:px-10 py-7 sm:py-9">
            {/* Decorative shapes */}
            <div className="absolute -right-16 -top-24 w-80 h-80 rounded-full bg-[#E6D9FF]/60" />

            <div className="absolute right-20 bottom-[-90px] w-64 h-64 rounded-full bg-white/50" />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-7">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-2 shadow-sm">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#5D35F5] to-[#744CFF] flex items-center justify-center text-white text-4xl sm:text-5xl font-bold">
                    {firstLetter}
                  </div>
                </div>

                <button
                  type="button"
                  className="
                    absolute
                    -right-1
                    -bottom-1
                    w-9
                    h-9
                    rounded-full
                    bg-white
                    border
                    border-gray-200
                    shadow-sm
                    flex
                    items-center
                    justify-center
                    text-[#6D4AFF]
                  "
                >
                  <UserRound size={17} />
                </button>
              </div>

              {/* User Information */}
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">
                  {user?.name}
                </h2>

                <p className="text-gray-600 mt-1">{user?.email}</p>

                <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-[#EDE5FF] text-[#6D4AFF] text-xs sm:text-sm font-medium">
                  <ShieldCheck size={15} />
                  Member since May 2026
                </div>
              </div>

              {/* Decorative Shopping Icon */}
              <div className="hidden md:flex ml-auto relative w-48 h-32 items-center justify-center">
                <div className="absolute right-8 bottom-3 w-28 h-24 rounded-xl bg-gradient-to-br from-[#6D4AFF] to-[#8A6AFF] shadow-lg flex items-center justify-center">
                  <ShoppingBag
                    size={54}
                    strokeWidth={1.5}
                    className="text-white"
                  />
                </div>

                <div className="absolute right-0 bottom-0 w-16 h-14 rounded-lg bg-[#F2A95C] flex items-center justify-center shadow-sm">
                  <Package size={28} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x-0 lg:divide-x divide-gray-200">
            {/* Orders */}
            <div className="flex items-center gap-4 px-6 sm:px-8 py-6 border-b lg:border-b-0 border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-[#F1ECFF] flex items-center justify-center shrink-0">
                <ShoppingBag size={23} className="text-[#6D4AFF]" />
              </div>

              <div>
                <p className="text-2xl font-bold text-[#111827]">
                  {ordersCount}
                </p>
                <p className="text-sm text-gray-500">Orders</p>
              </div>
            </div>

            {/* Wishlist */}
            <div className="flex items-center gap-4 px-6 sm:px-8 py-6 border-b lg:border-b-0 border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-[#EAF8F1] flex items-center justify-center shrink-0">
                <Heart size={23} className="text-green-500" />
              </div>

              <div>
                <p className="text-2xl font-bold text-[#111827]">
                  {wishlistCount}
                </p>
                <p className="text-sm text-gray-500">Wishlist Items</p>
              </div>
            </div>

            {/* Addresses */}
            <div className="flex items-center gap-4 px-6 sm:px-8 py-6">
              <div className="w-12 h-12 rounded-xl bg-[#FFF4E3] flex items-center justify-center shrink-0">
                <MapPin size={23} className="text-orange-500" />
              </div>

              <div>
                <p className="text-2xl font-bold text-[#111827]">
                  {hasSavedAddress ? "1" : "0"}
                </p>
                <p className="text-sm text-gray-500">Addresses</p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-4 px-6 sm:px-8 py-6">
              <div className="w-12 h-12 rounded-xl bg-[#EAF3FF] flex items-center justify-center shrink-0">
                <CreditCard size={23} className="text-blue-500" />
              </div>

              <div>
                <p className="text-2xl font-bold text-[#111827]">—</p>
                <p className="text-sm text-gray-500">Payment Methods</p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            PERSONAL INFORMATION
        ====================================================== */}
        <section className="mb-6">
          <ProfileForm user={user} fetchProfile={fetchProfile} />
        </section>

        {/* =====================================================
            SAVED ADDRESS
        ====================================================== */}
        <section
          id="saved-address"
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-7 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#F1ECFF] flex items-center justify-center shrink-0">
                <MapPin size={22} className="text-[#6D4AFF]" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#111827]">
                  Saved Address
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Save your delivery address for faster checkout
                </p>
              </div>
            </div>

            {hasSavedAddress && !addressEditing && (
              <button
                type="button"
                onClick={() => setAddressEditing(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#6D4AFF] text-[#6D4AFF] hover:bg-[#6D4AFF] hover:text-white transition text-sm font-medium cursor-pointer"
              >
                <Pencil size={16} />
                Edit Address
              </button>
            )}
          </div>

          {!hasSavedAddress && !addressEditing && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-[#FAFAFC] px-5 py-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-[#F1ECFF] flex items-center justify-center">
                <MapPin size={23} className="text-[#6D4AFF]" />
              </div>

              <h3 className="font-semibold text-[#111827] mt-4">
                No saved address yet
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Add your delivery address to make checkout faster.
              </p>

              <button
                type="button"
                onClick={() => setAddressEditing(true)}
                className="inline-flex items-center justify-center gap-2 mt-5 px-5 py-2.5 rounded-lg bg-[#6D4AFF] hover:bg-[#5936F7] text-white text-sm font-semibold transition cursor-pointer"
              >
                <MapPin size={17} />
                Add Address
              </button>
            </div>
          )}

          {(addressEditing || hasSavedAddress) && (
            <form onSubmit={handleSaveAddress}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2">
                    Full Name
                  </label>

                  <div className="relative">
                    <UserRound
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />

                    <input
                      type="text"
                      name="fullName"
                      value={addressData.fullName}
                      onChange={handleAddressChange}
                      required
                      placeholder="Enter full name"
                      className="w-full h-12 border border-gray-200 rounded-lg pl-11 pr-4 text-sm text-[#111827] outline-none transition focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/10"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2">
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={addressData.phone}
                      onChange={handleAddressChange}
                      required
                      placeholder="Enter phone number"
                      className="w-full h-12 border border-gray-200 rounded-lg pl-11 pr-4 text-sm text-[#111827] outline-none transition focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/10"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-[#111827] mb-2">
                    Address
                  </label>

                  <div className="relative">
                    <Home
                      size={18}
                      className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none"
                    />

                    <textarea
                      name="street"
                      value={addressData.street}
                      onChange={handleAddressChange}
                      required
                      rows="3"
                      placeholder="House / flat number, street, area"
                      className="w-full border border-gray-200 rounded-lg pl-11 pr-4 py-3 text-sm text-[#111827] outline-none transition resize-none focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/10"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2">
                    City
                  </label>

                  <div className="relative">
                    <Building2
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />

                    <input
                      type="text"
                      name="city"
                      value={addressData.city}
                      onChange={handleAddressChange}
                      required
                      placeholder="Enter city"
                      className="w-full h-12 border border-gray-200 rounded-lg pl-11 pr-4 text-sm text-[#111827] outline-none transition focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/10"
                    />
                  </div>
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2">
                    State
                  </label>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />

                    <input
                      type="text"
                      name="state"
                      value={addressData.state}
                      onChange={handleAddressChange}
                      required
                      placeholder="Enter state"
                      className="w-full h-12 border border-gray-200 rounded-lg pl-11 pr-4 text-sm text-[#111827] outline-none transition focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/10"
                    />
                  </div>
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2">
                    Pincode
                  </label>

                  <div className="relative">
                    <Package
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />

                    <input
                      type="text"
                      name="pincode"
                      value={addressData.pincode}
                      onChange={handleAddressChange}
                      required
                      placeholder="Enter pincode"
                      className="w-full h-12 border border-gray-200 rounded-lg pl-11 pr-4 text-sm text-[#111827] outline-none transition focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/10"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2">
                    Country
                  </label>

                  <div className="relative">
                    <Globe
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />

                    <input
                      type="text"
                      name="country"
                      value={addressData.country}
                      onChange={handleAddressChange}
                      required
                      placeholder="Enter country"
                      className="w-full h-12 border border-gray-200 rounded-lg pl-11 pr-4 text-sm text-[#111827] outline-none transition focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
                {hasSavedAddress && (
                  <button
                    type="button"
                    onClick={resetAddressForm}
                    className="px-5 py-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition cursor-pointer"
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  disabled={addressLoading}
                  className="inline-flex items-center justify-center gap-2 min-w-[150px] px-5 py-3 rounded-lg bg-[#6D4AFF] hover:bg-[#5936F7] text-white text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Save size={17} />
                  {addressLoading ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* =====================================================
            CHANGE PASSWORD
        ====================================================== */}
        <section className="mb-6">
          <ChangePassword />
        </section>

        {/* =====================================================
            QUICK ACTIONS
        ====================================================== */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-7 mb-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-[#F1ECFF] flex items-center justify-center shrink-0">
              <Zap size={22} className="text-[#6D4AFF]" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#111827]">
                Quick Actions
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Frequently used actions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* My Orders */}
            <div className="rounded-xl border border-[#E5DFFF] bg-[#FCFAFF] p-5 text-center">
              <div className="mx-auto w-12 h-12 rounded-xl bg-[#F1ECFF] flex items-center justify-center">
                <ShoppingBag size={23} className="text-[#6D4AFF]" />
              </div>

              <h3 className="font-semibold text-[#111827] mt-4">My Orders</h3>

              <p className="text-xs text-gray-500 mt-1">
                View and track your orders
              </p>

              <button
                onClick={() => navigate("/orders")}
                className="
                  w-full
                  mt-4
                  border
                  border-[#6D4AFF]
                  text-[#6D4AFF]
                  hover:bg-[#6D4AFF]
                  hover:text-white
                  rounded-lg
                  py-2
                  text-sm
                  font-medium
                  transition
                  cursor-pointer
                "
              >
                View Orders
              </button>
            </div>

            {/* Wishlist */}
            <div className="rounded-xl border border-pink-100 bg-pink-50/30 p-5 text-center">
              <div className="mx-auto w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                <Heart size={23} className="text-pink-500" />
              </div>

              <h3 className="font-semibold text-[#111827] mt-4">Wishlist</h3>

              <p className="text-xs text-gray-500 mt-1">
                View your saved items
              </p>

              <button
                onClick={() => navigate("/wishlist")}
                className="
                  w-full
                  mt-4
                  border
                  border-pink-400
                  text-pink-500
                  hover:bg-pink-500
                  hover:text-white
                  rounded-lg
                  py-2
                  text-sm
                  font-medium
                  transition
                  cursor-pointer
                "
              >
                View Wishlist
              </button>
            </div>

            {/* Address Book */}
            <div className="rounded-xl border border-green-100 bg-green-50/30 p-5 text-center">
              <div className="mx-auto w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <MapPin size={23} className="text-green-500" />
              </div>

              <h3 className="font-semibold text-[#111827] mt-4">
                Address Book
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Manage your addresses
              </p>

              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("saved-address")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="
                  w-full
                  mt-4
                  border
                  border-green-400
                  text-green-600
                  hover:bg-green-500
                  hover:text-white
                  rounded-lg
                  py-2
                  text-sm
                  font-medium
                  transition
                  cursor-pointer
                "
              >
                Manage Addresses
              </button>
            </div>

            {/* Payment Methods */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-5 text-center">
              <div className="mx-auto w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <CreditCard size={23} className="text-blue-500" />
              </div>

              <h3 className="font-semibold text-[#111827] mt-4">
                Payment Methods
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Manage your payment methods
              </p>

              <button
                type="button"
                className="
                  w-full
                  mt-4
                  border
                  border-blue-400
                  text-blue-600
                  hover:bg-blue-500
                  hover:text-white
                  rounded-lg
                  py-2
                  text-sm
                  font-medium
                  transition
                  cursor-pointer
                "
              >
                Manage Payments
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="mt-5 flex justify-end">
            <button
              onClick={handleLogout}
              className="
                flex
                items-center
                justify-center
                gap-2
                px-5
                py-2.5
                rounded-xl
                border
                border-red-200
                text-red-500
                hover:bg-red-500
                hover:text-white
                transition
                text-sm
                font-medium
                cursor-pointer
              "
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
