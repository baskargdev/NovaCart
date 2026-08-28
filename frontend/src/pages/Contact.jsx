import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Headphones,
  MessageCircle,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  User,
  FileText,
  Pencil,
  Send,
  Tag,
} from "lucide-react";
import { toast } from "react-toastify";

import axiosInstance from "../api/axiosInstance";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axiosInstance.post("/contact", formData);

      if (data.success) {
        toast.success(data.message);

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Contact form error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white min-h-screen">
      <div className="bg-[#F7F5FF]">
        <div
          className="
            max-w-[1800px]
            mx-auto
            px-4
            sm:px-6
            lg:px-10
            xl:px-12
            py-10
            md:py-14
          "
        >
          <div className="flex items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 text-sm mb-5">
                <Link to="/" className="text-gray-500 hover:text-[#6D4AFF]">
                  Home
                </Link>

                <span className="text-gray-400">›</span>

                <span className="text-[#6D4AFF] font-medium">Contact Us</span>
              </div>

              <h1
                className="
                  text-3xl
                  sm:text-4xl
                  lg:text-5xl
                  font-bold
                  text-[#1F1F2E]
                "
              >
                Contact Us
              </h1>

              <p className="text-gray-500 mt-3 max-w-xl text-sm sm:text-base leading-7">
                We'd love to hear from you! Reach out to us for any queries,
                feedback or support.
              </p>

              <div
                className="
                  flex
                  flex-wrap
                  gap-5
                  sm:gap-8
                  mt-6
                "
              >
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Headphones size={18} className="text-[#6D4AFF]" />
                  </div>

                  <span className="text-sm font-medium text-[#1F1F2E]">
                    Quick Support
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <MessageCircle size={18} className="text-[#6D4AFF]" />
                  </div>

                  <span className="text-sm font-medium text-[#1F1F2E]">
                    We're Here 24/7
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <ShieldCheck size={18} className="text-[#6D4AFF]" />
                  </div>

                  <span className="text-sm font-medium text-[#1F1F2E]">
                    Your Satisfaction Matters
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex">
              <div
                className="
                  w-36
                  h-36
                  lg:w-48
                  lg:h-48
                  rounded-full
                  bg-[#6D4AFF]
                  flex
                  items-center
                  justify-center
                  shadow-lg
                  shadow-purple-200
                "
              >
                <Mail size={85} strokeWidth={1.3} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="
          max-w-[1800px]
          mx-auto
          px-4
          sm:px-6
          lg:px-10
          xl:px-12
          py-8
          md:py-10
        "
      >
        <div
          className="
            grid
            lg:grid-cols-[330px_1fr_300px]
            gap-6
            border
            border-gray-100
            rounded-2xl
            p-4
            md:p-5
            shadow-sm
          "
        >
          <div className="border border-gray-100 rounded-2xl p-5 md:p-6">
            <h2 className="text-xl font-bold text-[#5A39F3] mb-6">
              Get In Touch
            </h2>

            <div className="flex gap-4 pb-5 border-b border-gray-100">
              <div className="w-11 h-11 shrink-0 rounded-full bg-[#F1EDFF] flex items-center justify-center">
                <Phone size={20} className="text-[#6D4AFF]" />
              </div>

              <div>
                <h3 className="font-semibold text-[#1F1F2E]">Phone</h3>

                <p className="text-sm text-gray-600 mt-1">+91 6369916856</p>

                <p className="text-sm text-gray-500">
                  Mon - Sun: 9:00 AM - 6:00 PM
                </p>
              </div>
            </div>

            <div className="flex gap-4 py-5 border-b border-gray-100">
              <div className="w-11 h-11 shrink-0 rounded-full bg-[#F1EDFF] flex items-center justify-center">
                <Mail size={20} className="text-[#6D4AFF]" />
              </div>

              <div>
                <h3 className="font-semibold text-[#1F1F2E]">Email</h3>

                <p className="text-sm text-gray-600 mt-1">
                  support@novacart.com
                </p>

                <p className="text-sm text-gray-500">
                  We reply within 24 hours
                </p>
              </div>
            </div>

            <div className="flex gap-4 py-5 border-b border-gray-100">
              <div className="w-11 h-11 shrink-0 rounded-full bg-[#F1EDFF] flex items-center justify-center">
                <MapPin size={20} className="text-[#6D4AFF]" />
              </div>

              <div>
                <h3 className="font-semibold text-[#1F1F2E]">Address</h3>

                <p className="text-sm text-gray-600 mt-1 leading-5">
                  NovaCart Private Limited
                  <br />
                  No. 123, Tech Park, Whitefield
                  <br />
                  Bengaluru, Karnataka - 560066
                  <br />
                  India
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-5">
              <div className="w-11 h-11 shrink-0 rounded-full bg-[#F1EDFF] flex items-center justify-center">
                <Clock size={20} className="text-[#6D4AFF]" />
              </div>

              <div>
                <h3 className="font-semibold text-[#1F1F2E]">Business Hours</h3>

                <p className="text-sm text-gray-500 mt-1">
                  Tue - Sun: 9:00 AM - 10:00 PM
                </p>

                <p className="text-sm text-gray-500">Monday: Closed</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-100 rounded-2xl p-5 md:p-6">
            <h2 className="text-xl font-bold text-[#5A39F3] mb-6">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="relative">
                  <User
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="
                      w-full
                      border
                      border-gray-200
                      rounded-xl
                      py-3
                      pl-11
                      pr-4
                      outline-none
                      text-sm
                      focus:border-[#6D4AFF]
                      focus:ring-2
                      focus:ring-purple-100
                    "
                  />
                </div>

                <div className="relative">
                  <Mail
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="
                      w-full
                      border
                      border-gray-200
                      rounded-xl
                      py-3
                      pl-11
                      pr-4
                      outline-none
                      text-sm
                      focus:border-[#6D4AFF]
                      focus:ring-2
                      focus:ring-purple-100
                    "
                  />
                </div>
              </div>

              <div className="relative">
                <FileText
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-xl
                    py-3
                    pl-11
                    pr-4
                    outline-none
                    text-sm
                    focus:border-[#6D4AFF]
                    focus:ring-2
                    focus:ring-purple-100
                  "
                />
              </div>

              <div className="relative">
                <Pencil
                  size={18}
                  className="
                    absolute
                    left-4
                    top-4
                    text-gray-400
                  "
                />

                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  maxLength={1000}
                  rows={7}
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-xl
                    py-3
                    pl-11
                    pr-4
                    outline-none
                    text-sm
                    resize-none
                    focus:border-[#6D4AFF]
                    focus:ring-2
                    focus:ring-purple-100
                  "
                />

                <span className="absolute right-4 bottom-3 text-xs text-gray-400">
                  {formData.message.length} / 1000
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  bg-[#6D4AFF]
                  hover:bg-[#5936F7]
                  disabled:bg-gray-400
                  text-white
                  px-7
                  py-3
                  rounded-xl
                  font-semibold
                  transition
                "
              >
                <Send size={18} />

                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          <div
            className="
              rounded-2xl
              bg-[#F7F5FF]
              p-6
              flex
              flex-col
              items-center
              justify-center
              text-center
            "
          >
            <div
              className="
                w-32
                h-32
                rounded-full
                bg-white
                flex
                items-center
                justify-center
                mb-6
              "
            >
              <Headphones
                size={70}
                strokeWidth={1.5}
                className="text-[#6D4AFF]"
              />
            </div>

            <h2 className="text-xl font-bold text-[#1F1F2E]">
              Need Immediate Help?
            </h2>

            <p className="text-gray-500 text-sm mt-3 leading-6">
              Chat with our support team for quick assistance.
            </p>

            <button
              type="button"
              onClick={() => toast.info("Live chat will be available soon.")}
              className="
                mt-6
                w-full
                border-2
                border-[#6D4AFF]
                text-[#5A39F3]
                hover:bg-[#6D4AFF]
                hover:text-white
                px-5
                py-3
                rounded-xl
                font-semibold
                transition
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <MessageCircle size={18} />
              Start Live Chat
            </button>
          </div>
        </div>

        <section
          className="
            mt-8
            rounded-2xl
            bg-gradient-to-r
            from-[#5A39F3]
            to-[#6D4AFF]
            px-5
            py-6
            sm:px-8
            sm:py-7
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-5
            text-white
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                w-12
                h-12
                rounded-full
                bg-white/20
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <Tag size={23} />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                We Value Your Feedback!
              </h2>

              <p className="text-white/80 text-sm sm:text-base mt-1">
                Your feedback helps us improve and provide you with the best
                experience.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toast.info("Feedback form will be available soon.")}
            className="
              bg-white
              text-[#5A39F3]
              hover:bg-gray-100
              px-6
              py-3
              rounded-xl
              font-semibold
              transition
              whitespace-nowrap
            "
          >
            Share Your Feedback →
          </button>
        </section>
      </div>
    </section>
  );
};

export default Contact;
