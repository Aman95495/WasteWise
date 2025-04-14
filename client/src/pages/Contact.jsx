import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/contact/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }

      setTimeout(() => {
        setStatus(null);
      }, 5000);
    } 
    catch (error) {
        setStatus("error");
    
        setTimeout(() => {
            setStatus(null);
        }, 5000);
    }
  };

  return (
    <div className="bg-slate-50 py-16 px-4 mt-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 text-center mb-8">
          Contact Us
        </h1>
        <p className="text-lg text-slate-600 text-center mb-12">
          We're here to help! Reach out to us for any inquiries or assistance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="5"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  required
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-slate-800 text-white py-3 rounded-lg hover:bg-slate-700 transition-colors"
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>
              {status === "success" && (
                <p className="text-green-600">
                  Your message has been sent successfully!
                </p>
              )}
              {status === "error" && (
                <p className="text-red-600">
                  Failed to send the message. Try again later.
                </p>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Contact Information
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <FaPhone className="text-2xl text-slate-700 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Phone
                  </h3>
                  <p className="text-slate-600">+91 ----------</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaEnvelope className="text-2xl text-slate-700 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Email
                  </h3>
                  <p className="text-slate-600">chatwise@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-2xl text-slate-700 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Address
                  </h3>
                  <p className="text-slate-600">
                    Subhash Nagar, Dehradun
                    <br />
                    Uttarakhand, India - 248001
                  </p>
                </div>
              </div>
            </div>

            {/* Map Integration */}
            <div className="mt-8">
              <iframe
                title="MyEstate Location"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1024.4857102764604!2d77.98694340075737!3d30.26713557919493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1738065887188!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}