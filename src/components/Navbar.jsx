import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Satellite } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Service And Publication", path: "/ServiceAndPublication" },
    { name: "Staff", path: "/staff" },
    { name: "Contact Us", path: "/contactUs" },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Satellite className="h-8 w-8 text-secondary" />
            <div>
              <h1 className="text-xl font-bold text-secondary">Remote Sensing</h1>
              <p className="text-sm text-gray-600">Department</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center space-x-8">
            {navLinks.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "text-primary bg-gray-100"
                      : "text-secondary hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
             <li>
    <Link
                  to="/rms/login"
                  className="block px-3 py-2 rounded-md text-sm font-medium transition-colors text-secondary hover:text-primary hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
  </li>
          </ul>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="text-secondary hover:text-primary transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden">
            <ul className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 rounded-lg mb-4">
              {navLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? "text-primary bg-gray-100"
                        : "text-secondary hover:text-primary hover:bg-gray-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
