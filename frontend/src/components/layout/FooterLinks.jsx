import { Link } from "react-router-dom";

const FooterLinks = ({ title, links }) => {
  return (
    <div>
      <h3 className="mb-5 text-lg font-semibold text-[#1F1F2E]">{title}</h3>

      <ul className="space-y-3">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              to={link.path}
              className="text-gray-500 transition hover:text-[#6D4AFF]"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterLinks;
