import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";

import mobileImage from "../../assets/images/login-mobile.png";
import desktopImage from "../../assets/images/login-desktop.png";
import logo from "../../assets/logos/novacart-logo.png";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
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

    setLoading(true);

    try {
      const { data } = await axiosInstance.post("/user/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log(data);

      login(data.user, data.token);

      toast.success("Login Successful!");

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error.response?.data || error.message);

      toast.error(error.response?.data?.message || "Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT SIDE */}

          <div className="p-8 md:p-14">
            {/* Logo */}
            <img src={logo} alt="NovaCart" className="h-15 md:h-25 mb-4" />
            {/* Heading */}
            <h1 className="text-2xl md:text-5xl font-bold leading-tight text-[#1F1F2E]">
              Welcome <span className="text-[#6D4AFF]">back!</span>
            </h1>
            <p className="mt-4 text-xs md:text-lg text-gray-500">
              Login to continue your journey
            </p>
            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Email */}

              <div className="relative">
                <FiMail
                  className="absolute left-5 top-1/2 -translate-y-1/2
                  text-lg md:text-2xl text-[#6D4AFF]"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200
                  py-3 md:py-5
                  pl-14 md:pl-16
                  pr-3
                  text-xs md:text-base
                  focus:border-[#6D4AFF]
                  transition
                  hover:bg-purple-50"
                />
              </div>

              {/* Password */}

              <div className="relative">
                <FiLock
                  className="absolute left-5 top-1/2 -translate-y-1/2
                  text-lg md:text-2xl text-[#6D4AFF]"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200
                  py-3 md:py-5
                  pl-14 md:pl-16
                  pr-12
                  text-xs md:text-base
                  focus:border-[#6D4AFF]
                  transition
                  hover:bg-purple-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <FiEyeOff className="text-sm md:text-lg text-[#6D4AFF]" />
                  ) : (
                    <FiEye className="text-sm md:text-lg text-[#6D4AFF]" />
                  )}
                </button>
              </div>

              {/* Remember */}

              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="accent-[#6D4AFF]"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  className="text-[#6D4AFF] text-xs md:text-sm hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl
                bg-gradient-to-r
              from-[#6D4AFF]
              to-[#8B5CF6]
                py-0.5 md:py-3
                text-base md:text-lg
                font-semibold
              text-white
                flex items-center justify-center gap-3
                transition hover:scale-[1.02]
                disabled:opacity-60
                disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
                <span className="text-2xl mb-1">→</span>
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
            {/* Social */}
            <div className="grid grid-cols-3 gap-4">
              <button className="flex h-14 items-center justify-center rounded-2xl border border-gray-200 hover:bg-purple-50">
                <FcGoogle className="text-xl md:text-4xl" />
              </button>

              <button className="flex h-14 items-center justify-center rounded-2xl border border-gray-200 hover:bg-purple-50">
                <FaGithub className="text-xl md:text-4xl" />
              </button>

              <button className="flex h-14 items-center justify-center rounded-2xl border border-gray-200 hover:bg-purple-50">
                <FaFacebook className="text-xl md:text-4xl text-blue-600" />
              </button>
            </div>
            {/* Register */}
            <p className="mt-10 text-center text-gray-500 text-xs md:text-base">
              Don't have an account?
              <Link
                to="/register"
                className="ml-2 font-semibold text-[#6D4AFF] px-2 rounded-xl hover:bg-purple-50"
              >
                Sign Up
              </Link>
            </p>
          </div>

          {/* Desktop Image */}

          <div className="hidden lg:flex bg-[#F3EEFF]">
            <img
              src={desktopImage}
              alt="Login Illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mobile Image */}

        <div className="lg:hidden bg-[#F3EEFF]">
          <img
            src={mobileImage}
            alt="Login Illustration"
            className="w-full h-full object-cover rounded-b-3xl"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
