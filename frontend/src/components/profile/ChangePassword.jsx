import { useState } from "react";

import axiosInstance from "../../api/axiosInstance";

import { toast } from "react-toastify";

import { LockKeyhole, Eye, EyeOff, ShieldCheck, KeyRound } from "lucide-react";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data } = await axiosInstance.put(
        "/user/change-password",
        formData,
      );

      if (data.success) {
        toast.success(data.message);

        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-7">
      {/* Header */}
      <div className="flex items-start gap-3 mb-7">
        <div className="w-11 h-11 rounded-xl bg-[#F1ECFF] flex items-center justify-center shrink-0">
          <LockKeyhole size={22} className="text-[#6D4AFF]" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#111827]">Change Password</h2>

          <p className="text-sm text-gray-500 mt-1">
            Keep your account secure by updating your password
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-[#E5DFFF] bg-[#FAF8FF] p-4 mb-6">
        <ShieldCheck size={19} className="text-[#6D4AFF] mt-0.5 shrink-0" />

        <div>
          <p className="text-sm font-medium text-[#3D2B80]">
            Keep your password secure
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Use a strong password that you don't use on other websites.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Current Password */}
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-[#111827] mb-2"
            >
              Current Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="
                  absolute
                  left-3.5
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  pointer-events-none
                "
              />

              <input
                id="currentPassword"
                type={showPassword.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="
                  w-full
                  h-12
                  border
                  border-gray-200
                  rounded-lg
                  pl-11
                  pr-11
                  text-sm
                  text-[#111827]
                  outline-none
                  transition
                  focus:border-[#6D4AFF]
                  focus:ring-2
                  focus:ring-[#6D4AFF]/10
                "
              />

              <button
                type="button"
                onClick={() => togglePassword("current")}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  hover:text-[#6D4AFF]
                  transition
                  cursor-pointer
                "
              >
                {showPassword.current ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-[#111827] mb-2"
            >
              New Password
            </label>

            <div className="relative">
              <KeyRound
                size={18}
                className="
                  absolute
                  left-3.5
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  pointer-events-none
                "
              />

              <input
                id="newPassword"
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="
                  w-full
                  h-12
                  border
                  border-gray-200
                  rounded-lg
                  pl-11
                  pr-11
                  text-sm
                  text-[#111827]
                  outline-none
                  transition
                  focus:border-[#6D4AFF]
                  focus:ring-2
                  focus:ring-[#6D4AFF]/10
                "
              />

              <button
                type="button"
                onClick={() => togglePassword("new")}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  hover:text-[#6D4AFF]
                  transition
                  cursor-pointer
                "
              >
                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[#111827] mb-2"
            >
              Confirm Password
            </label>

            <div className="relative">
              <KeyRound
                size={18}
                className="
                  absolute
                  left-3.5
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  pointer-events-none
                "
              />

              <input
                id="confirmPassword"
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="
                  w-full
                  h-12
                  border
                  border-gray-200
                  rounded-lg
                  pl-11
                  pr-11
                  text-sm
                  text-[#111827]
                  outline-none
                  transition
                  focus:border-[#6D4AFF]
                  focus:ring-2
                  focus:ring-[#6D4AFF]/10
                "
              />

              <button
                type="button"
                onClick={() => togglePassword("confirm")}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  hover:text-[#6D4AFF]
                  transition
                  cursor-pointer
                "
              >
                {showPassword.confirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              min-w-[165px]
              px-5
              py-3
              rounded-lg
              bg-[#6D4AFF]
              hover:bg-[#5936F7]
              text-white
              text-sm
              font-semibold
              transition
              disabled:opacity-60
              disabled:cursor-not-allowed
              cursor-pointer
            "
          >
            <ShieldCheck size={17} />

            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
