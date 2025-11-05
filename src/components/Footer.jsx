import React from 'react';
import { Satellite, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary mt-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Satellite className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-xl font-bold">Remote Sensing Department</h3>
                <p className="text-sm text-gray-300">Advanced Earth Observation</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Leading research and innovation in remote sensing technologies, providing cutting-edge solutions 
              for environmental monitoring, resource management, and sustainable development.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="/ServiceAndPublication" className="hover:text-primary transition-colors">Service And Publication</a></li>
              <li><a href="/staff" className="hover:text-primary transition-colors">Staff Profile</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4"><a href="/contactUs">Contact Us</a></h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start space-x-3">
                <a href="/contactUs"><MapPin className="h-5 w-5 text-primary mt-0.5" /></a>
                <div>
                  <p>Remote Sensing Department</p>
                  <p>SSGI</p>
                  <p>Adiss Abeba, Ethiopia</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <p>+251 934 42 34 88</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <p>info@remotesensing.edu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-600 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2025 Remote Sensing Department. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;