import React, { useState, useEffect } from "react";
import { Zap, Users, Globe } from "lucide-react"; 
import axios from "axios";

export default function About() {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/about/") 
      .then((res) => {
        if (res.data.length > 0) {
          setAboutData(res.data[0]); 
        }
      })
      .catch((err) => console.error(err));
  }, []);

  if (!aboutData) {
    return <p className="text-center py-20">Loading About Page...</p>;
  }

  return (
    <section className="bg-gray-50">
      

      {/* Vision, Mission, Core Values */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Vision */}
            <div className="card border-t-4 bg-white shadow-md border-t-[#DD994D] rounded-lg p-6 hover:shadow-lg transition duration-300 text-center">
              <h3 className="text-xl font-semibold mb-4 text-secondary">Our Vision</h3>
              <p className="text-gray-700 text-justify" >{aboutData.vision}</p>
            </div>

            {/* Mission */}
            <div className="card border-t-4 bg-white shadow-md border-t-[#DD994D] rounded-lg p-6 hover:shadow-lg transition duration-300 text-center">
              <h3 className="text-xl font-semibold mb-4 text-secondary">Our Mission</h3>
              <p className="text-gray-700 text-justify">{aboutData.mission}</p>
            </div>

            {/* Core Values */}
            <div className="card border-t-4 bg-white shadow-md border-t-[#DD994D] rounded-lg p-6 hover:shadow-lg transition duration-300 text-center md:col-span-1">
              <h3 className="text-xl font-semibold mb-6 text-secondary">Our Core Values</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-2">
                  <Zap className="w-6 h-6 text-primary mb-2"/>
                  <span className="text-gray-700 font-medium text-sm sm:text-base">Innovation</span>
                </div>
                <div className="flex flex-col items-center p-2">
                  <Users className="w-6 h-6 text-primary mb-2"/>
                  <span className="text-gray-700 font-medium text-sm sm:text-base">Collaboration</span>
                </div>
                <div className="flex flex-col items-center p-2">
                  <Globe className="w-6 h-6 text-primary mb-2"/>
                  <span className="text-gray-700 font-medium text-sm sm:text-base">Sustainability</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-primary mb-8">Our Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {aboutData.resources?.map((resource) => (
              <div key={resource.id} className="bg-white p-10 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-3">{resource.title}</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {resource.items?.map((item) => (
                    <li key={item.id}>{item.text}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}