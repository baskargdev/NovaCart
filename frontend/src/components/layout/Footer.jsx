import { Link } from "react-router-dom";

import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

import logo from "../../assets/logos/novacart-main-logo.png";

import FeatureBar from "./FeatureBar";
import FooterLinks from "./FooterLinks";
import Newsletter from "./Newsletter";
import Copyright from "./Copyright";

const quickLinks = [
  { name: "About Us", path: "/about" },
  { name: "Contact Us", path: "/contact" },
  { name: "Shipping & Delivery", path: "/shipping" },
  { name: "Return Policy", path: "/returns" },
  { name: "Terms & Conditions", path: "/terms" },
];

const customerService = [
  { name: "My Account", path: "/profile" },
  { name: "Track Order", path: "/orders" },
  { name: "Wishlist", path: "/wishlist" },
  { name: "Help Center", path: "/help" },
  { name: "FAQs", path: "/faq" },
];

const Footer = () => {
  return (
    <>
      {/* Feature Bar */}
      <FeatureBar />

      {/* Main Footer */}
      <footer className="mt-4 bg-white border-t border-gray-200">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-10 xl:px-12 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company */}

            <div>
              <Link to="/">
                <img src={logo} alt="NovaCart" className="h-10" />
              </Link>

              <p className="mt-5 text-gray-500 leading-7">
                Your one-stop destination for quality products, unbeatable
                prices and secure shopping.
              </p>

              <div className="mt-6 flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#F5F1FF]
                  flex items-center justify-center
                  text-[#6D4AFF]
                  hover:bg-[#6D4AFF]
                  hover:text-white
                  transition"
                >
                  <FaFacebookF />
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#F5F1FF]
                  flex items-center justify-center
                  text-[#6D4AFF]
                  hover:bg-[#6D4AFF]
                  hover:text-white
                  transition"
                >
                  <FaInstagram />
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#F5F1FF]
                  flex items-center justify-center
                  text-[#6D4AFF]
                  hover:bg-[#6D4AFF]
                  hover:text-white
                  transition"
                >
                  <FaTwitter />
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#F5F1FF]
                  flex items-center justify-center
                  text-[#6D4AFF]
                  hover:bg-[#6D4AFF]
                  hover:text-white
                  transition"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>

            {/* Quick Links */}

            <FooterLinks title="Quick Links" links={quickLinks} />

            {/* Customer Service */}

            <FooterLinks title="Customer Service" links={customerService} />

            {/* Newsletter */}

            <Newsletter />
          </div>
        </div>

        <Copyright />
      </footer>
    </>
  );
};

export default Footer;
