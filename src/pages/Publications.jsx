import React, { useState, useEffect } from "react";
import axios from "axios";
import PublicationCard from "../components/PublicationCard";
import Products from "./Products";

export default function Publications() {
  const [filter, setFilter] = useState("Book");
  const [search, setSearch] = useState("");
  const [publicationData, setPublicationData] = useState([]);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const increment = 6;

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/publications/publication/")
      .then((res) => setPublicationData(res.data))
      .catch((err) => {
        console.error("API Error:", err);
        setError("Failed to load publications.");
      });
  }, []);

  // Filter, search, and sort
  const filteredData = publicationData
    .filter((item) => item.type === filter)
    .filter((item) =>
      filter === "Paper"
        ? item.title.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .sort((a, b) => b.year - a.year);

  // Reset visible count when filter/search changes
  useEffect(() => {
    setVisibleCount(increment);
  }, [filter, search]);

  // Items to show
  const visibleItems = filteredData.slice(0, visibleCount);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white text-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Publications and Outputs
            </h1>
            <p className="text-xl lg:text-2xl max-w-4xl mx-auto text-secondary">
              Explore our comprehensive collection of books, research papers,
              service, and products contributing to the advancement of remote
              sensing science.
            </p>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      </section>

      {/* Filter & Search */}
      <div className="px-6 py-10 max-w-7xl mx-auto">
        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {["Book", "Paper"].map((type) => (
            <button
              key={type}
              className={`px-6 py-2 rounded-md font-medium ${
                filter === type
                  ? "bg-secondary text-primary"
                  : "text-secondary border border-[#204E67] hover:bg-gray-100"
              }`}
              onClick={() => setFilter(type)}
            >
              {type}s
            </button>
          ))}
        </div>

        {/* Search Bar (only for Papers) */}
        {filter === "Paper" && (
          <div className="mb-6 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search papers by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#204E67]"
            />
          </div>
        )}

        {/* Publication List */}
        <section className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item) => (
            <PublicationCard
              key={item.id}
              type={item.type}
              title={item.title}
              abstract={item.description}
              authors={item.authors}
              year={item.year}
              link={item.link}
            />
          ))}
        </section>

        {/* Load More Button */}
        {visibleCount < filteredData.length && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setVisibleCount((prev) => prev + increment)}
              className="px-6 py-2 bg-secondary text-primary rounded-md font-medium hover:bg-[#1b3c4f]"
            >
              Load More
            </button>
          </div>
        )}

        <Products />
      </div>
    </div>
  );
}