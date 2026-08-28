import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance.js";
import { Link } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { toast } from "react-toastify";

import mobileImage from "../../assets/images/register-mobile.png";
import desktopImage from "../../assets/images/register-desktop.png";
import logo from "../../assets/logos/novacart-logo.png";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agree) {
      toast.warning("Please agree to the Terms & Privacy Policy");
      return;
    }

    try {
      const response = await axiosInstance.post("/user/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      console.log(response.data);

      toast.success("Registration Successful!");

      setFormData({
        name: "",
        email: "",
        password: "",
        agree: false,
      });
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (error) {
      console.log(error.response?.data || error.message);

      toast.error(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Main Grid */}

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* ===========================
                LEFT SIDE
          ============================ */}

          <div className="p-8 md:p-14">
            {/* Logo */}

            <img src={logo} alt="NovaCart" className="h-15 md:h-25 mb-4" />

            {/* Heading */}

            <h1 className="text-2xl md:text-5xl font-bold leading-tight text-[#1F1F2E]">
              Create <span className="text-[#6D4AFF]">your</span>
              <br />
              account
            </h1>

            <p className="mt-4 text-sm md:text-lg text-gray-500">
              Join us today! It's quick and easy.
            </p>

            {/* Form */}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Name */}

              <div className="relative">
                <FiUser
                  className="absolute left-5 top-1/2
                  -translate-y-1/2
                  text-xl md:text-2xl text-[#6D4AFF]"
                />

                <input
                  type="text"
                  name="name"
                  placeholder="First Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 py-3 
                  md:py-5 pl-14 md:pl-16 pr-3 text-xs md:text-base
                  focus:border-[#6D4AFF] border-gray-200 transition hover:bg-purple-50"
                />
              </div>

              {/* Email */}

              <div className="relative">
                <FiMail
                  className="absolute left-5 top-1/2
                  -translate-y-1/2
                  text-xl md:text-2xl text-[#6D4AFF]"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 py-3
                  md:py-5 pl-14 md:pl-16 pr-3 text-xs md:text-base
                  focus:border-[#6D4AFF] border-gray-200 transition hover:bg-purple-50"
                />
              </div>

              {/* Password */}

              <div className="relative">
                <FiLock
                  className="absolute left-5 top-1/2
                  -translate-y-1/2
                  text-xl md:text-2xl text-[#6D4AFF]"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 py-3 
                  md:py-5 pl-14 
                  md:pl-16 pr-3 text-xs md:text-base
                  focus:border-[#6D4AFF] border-gray-200 transition hover:bg-purple-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2
                  -translate-y-1/2"
                >
                  {showPassword ? (
                    <FiEyeOff className="text-sm md:text-lg text-[#6D4AFF]" />
                  ) : (
                    <FiEye className="text-sm md:text-lg text-[#6D4AFF]" />
                  )}
                </button>
              </div>

              <p className="text-gray-500 text-xs md:text-sm">
                At least 6 characters with a mix of letters, numbers & symbols.
              </p>
              {/* Terms & Conditions */}

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 accent-[#6D4AFF] "
                />

                <p className="text-gray-500 leading-6 text-xs md:text-sm">
                  I agree to the{" "}
                  <span className="font-semibold text-[#6D4AFF] cursor-pointer">
                    Terms of Use
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-[#6D4AFF] cursor-pointer">
                    Privacy Policy
                  </span>
                </p>
              </div>

              {/* Sign Up Button */}

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6] 
                py-2 md:py-4 text-base md:text-lg font-semibold 
                text-white transition hover:scale-[1.02]"
              >
                Sign Up
              </button>
            </form>

            {/* Divider */}

            <div className="my-10 flex items-center">
              <div className="h-px flex-1 bg-gray-300"></div>

              <span className="mx-4 text-gray-500 text-xs md:text-sm">
                or continue with
              </span>

              <div className="h-px flex-1 bg-gray-300"></div>
            </div>

            {/* Social Login */}

            <div className="grid grid-cols-3 gap-4">
              <button className="flex h-14 items-center justify-center rounded-2xl border border-gray-200 transition hover:bg-purple-50">
                <FcGoogle className="text-xl md:text-4xl" />
              </button>

              <button className="flex h-14 items-center justify-center rounded-2xl border border-gray-200 transition hover:bg-purple-50">
                <FaGithub className="text-xl md:text-4xl" />
              </button>

              <button className="flex h-14 items-center justify-center rounded-2xl border border-gray-200 transition hover:bg-purple-50">
                <FaFacebook className="text-xl md:text-4xl text-blue-600" />
              </button>
            </div>

            {/* Login */}

            <p className="mt-10 text-center text-gray-500 text-xs md:text-base">
              Already have an account?
              <Link
                to="/login"
                className="ml-2 font-semibold text-[#6D4AFF] rounded-2xl px-2 border-gray-200 transition hover:bg-purple-50"
              >
                Login
              </Link>
            </p>
          </div>

          {/* ===========================
                RIGHT SIDE
          ============================ */}

          {/* Right Side */}
          <div className="hidden lg:flex bg-[#F3EEFF]">
            <img
              src={desktopImage}
              alt="Register Illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* ===========================
             MOBILE IMAGE
        ============================ */}

        {/* Mobile Image */}
        <div className="lg:hidden bg-[#F3EEFF] p-0">
          <img
            src={mobileImage}
            alt="Register Illustration"
            className="w-full h-full object-cover rounded-b-3xl"
          />
        </div>
      </div>
    </div>
  );
}

export default Register;
