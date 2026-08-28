import { useEffect, useState } from "react";

import axiosInstance from "../../api/axiosInstance";

import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import { UserRound, Mail, Save } from "lucide-react";

const ProfileForm = ({ user, fetchProfile }) => {
  const { login, token } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

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
      const { data } = await axiosInstance.put("/user/profile", formData);

      if (data.success) {
        toast.success(data.message);

        // Update AuthContext
        login(data.user, token);

        fetchProfile();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-7">
      {/* Header */}
      <div className="flex items-start gap-3 mb-7">
        <div className="w-11 h-11 rounded-xl bg-[#F1ECFF] flex items-center justify-center shrink-0">
          <UserRound size={23} className="text-[#6D4AFF]" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#111827]">
            Personal Information
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Update your personal details and contact information
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#111827] mb-2"
            >
              Full Name
            </label>

            <div className="relative">
              <UserRound
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
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="
                  w-full
                  h-12
                  border
                  border-gray-200
                  rounded-lg
                  pl-11
                  pr-4
                  text-sm
                  text-[#111827]
                  bg-white
                  outline-none
                  transition
                  focus:border-[#6D4AFF]
                  focus:ring-2
                  focus:ring-[#6D4AFF]/10
                "
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#111827] mb-2"
            >
              Email Address
            </label>

            <div className="relative">
              <Mail
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
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="
                  w-full
                  h-12
                  border
                  border-gray-200
                  rounded-lg
                  pl-11
                  pr-4
                  text-sm
                  text-[#111827]
                  bg-white
                  outline-none
                  transition
                  focus:border-[#6D4AFF]
                  focus:ring-2
                  focus:ring-[#6D4AFF]/10
                "
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              min-w-[148px]
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
            <Save size={17} />

            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
