import React, { useState } from "react";
import axios from "axios";
import { MapPin, Phone, Mail, Send, Clock } from "lucide-react";

export default function ContactUs() {
  const [success, setSuccess] = useState(null);

  function sendMessage(formData) {
    const data = Object.fromEntries(formData);

   axios.post("http://127.0.0.1:8000/contact/submit/", data)
      .then((res) => {
        console.log("Message sent:", res.data);
        setSuccess("Message sent successfully!");
      })
      .catch((err) => {
        console.error("Error sending message:", err);
        setSuccess("Failed to send message. Please try again.");
      });
  }

  return (
    <section className="bg-gray-50">
      {/* Header */}
      <div className="bg-secondary text-white py-20 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold mb-6">Contact Us</h1>
        <p className="text-lg lg:text-xl">Get in touch with us for any enquiries and questions</p>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
        {/* Department Info */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl text-secondary font-bold mb-6">Department Information</h2>
          <div className="space-y-6 text-gray-700">
            <div className="flex items-start space-x-3">
              <MapPin className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Address</h3>
                <p>
                  Space Science and Geospatial Institute <br />
                  Remote Sensing Department <br />
                  Addis Ababa, 4 Kilo <br />
                  Ethiopia
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p>
                  Main Office: +251 963 34 23 <br />
                  Department: +251 963 34 23
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Mail className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p>remoteSensing@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Office Hours</h3>
                <p>
                  Monday–Friday: 8:30 AM – 10:30 PM <br />
                  Saturday–Sunday: Closed
                </p>
              </div>
            </div>
           {/* OpenStreetMap Integration */}
          <div className="mt-8 h-64 bg-gray-200 rounded-lg overflow-hidden">
  <iframe
    width="100%"
    height="100%"
    frameBorder="0"
    scrolling="no"
      src="https://www.openstreetmap.org/export/embed.html?bbox=38.761915%2C9.019048%2C38.763915%2C9.021048&layer=mapnik&marker=9.020048%2C38.762915"
      style={{ border: 'none' }}
  ></iframe>
</div>

{/* Link to full OpenStreetMap page */}
<div className="text-center mt-2">
  <small>
    <a 
       href="https://www.openstreetmap.org/?mlat=9.0202&mlon=38.7635#map=16/9.0202/38.7635" 
    target="_blank" 
      rel="noopener noreferrer"
      className="text-primary hover:underline"
    >
      View Larger Map
    </a>
  </small>
</div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl text-secondary font-bold mb-6">Send Us a Message</h2>
            {success && <p className="mt-4 text-green-500 mb-3">{success}</p>}
          <form
            className="flex flex-col space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(new FormData(e.target));
              e.target.reset();
            }}
          >
            <input type="text" name="name" placeholder="Your Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DD994D]" required />
            <input type="email" name="email" placeholder="Your Email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DD994D]" required />
            <input type="text" name="subject" placeholder="Subject" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DD994D]" required />
            <textarea name="message" placeholder="Your Message" rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DD994D]" required />
            <button type="submit" className="flex items-center justify-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-primary transition duration-300">
              Send Message <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
