import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 overflow-hidden">
      {/* Space-themed background */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-purple-900 to-indigo-900">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            opacity: 0.3,
          }}
        ></div>
      </div>

      <div className="relative container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#home"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#projects"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="#experience"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Experience
                </Link>
              </li>
              <li>
                <Link
                  href="#testimonials"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Icons */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-4">
              Connect With Me
            </h3>
            <div className="flex justify-center space-x-4">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaGithub className="text-2xl" />
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaLinkedin className="text-2xl" />
              </a>
              <a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaTwitter className="text-2xl" />
              </a>
              <a
                href="mailto:your.email@example.com"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaEnvelope className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Copyright and Legal */}
          <div className="text-center md:text-right">
            <p className="text-gray-300 mb-2">
              &copy; {currentYear} Musa Musa Kannike
            </p>
            <p className="text-gray-400 text-sm">All rights reserved</p>
            <p className="text-gray-400 text-sm mt-2">
              <Link
                href="/privacy-policy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              {" | "}
              <Link
                href="/terms-of-service"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Design Element */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-400 text-sm">
            Designed and built with{" "}
            <span className="text-red-500">&hearts;</span> by Musa Musa Kannike
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
