import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import ResearchCard from "../components/ResearchCard";
import axios from "axios";

export default function Research() {
  const [filter, setFilter] = useState("Active");
  const [researchData, setResearchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResearchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios .get("http://127.0.0.1:8000/mandate/research/");
        setResearchData(response.data);
      } catch (err) {
        console.error("Error fetching research data:", err);
        setError("Failed to load research projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResearchData();
  }, []);

  // Filter logic: "Developed" shows both Completed and Published
  const filteredData = researchData.filter((item) => {
    if (filter === "Active") {
      return item.type === "Active";
    } else if (filter === "Developed") {
      return item.type === "Completed" || item.type === "Published";
    }
    return false;
  });

  return (
    <section id="research" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4">
            Research and Developments (R&D)
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conducting cutting-edge research projects that advance remote
            sensing science and address real-world challenges.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Current Research Areas */}
          <div>
            <h3 className="text-2xl font-bold text-secondary mb-6">
              Current Research Areas
            </h3>
            <div className="space-y-4">
              {[
                {
                  title: "Climate Change Monitoring",
                  desc: "Long-term climate data analysis and impact assessment.",
                },
                {
                  title: "Agricultural Remote Sensing",
                  desc: "Crop monitoring and precision agriculture solutions.",
                },
                {
                  title: "Urban Environmental Monitoring",
                  desc: "Air quality, heat islands, and urban sustainability studies.",
                },
                {
                  title: "Natural Resource Management",
                  desc: "Forest monitoring, water resources, and biodiversity conservation.",
                },
              ].map((area, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-secondary">{area.title}</h4>
                    <p className="text-gray-600">{area.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h4 className="font-bold text-secondary mb-4">Research Statistics</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {researchData.filter(item => item.type === 'Active').length}
                  </div>
                  <div className="text-sm text-gray-600">Active Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {researchData.filter(item => item.type === 'Completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter + Project List */}
          <div>
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { key: "Active", label: "Active Projects" },
                { key: "Developed", label: "Developed Projects" }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    filter === key
                      ? "bg-secondary text-white shadow-md"
                      : "bg-white text-secondary border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>


            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Projects Grid */}
            {!loading && !error && (
              <div className="space-y-6">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <ResearchCard
                      key={item.id}
                      type={item.type}
                      title={item.title}
                      link={item.link}
                      authors={item.authors}
                      description={item.description}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-500 text-lg mb-2">
                      No {filter.toLowerCase()} projects available.
                    </p>
                    <p className="text-gray-400 text-sm">
                      Check back later for new research projects.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}