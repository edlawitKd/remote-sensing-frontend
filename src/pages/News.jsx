import React, { useEffect, useState } from "react";
import axios from "axios";

export default function News() {
  const [filter, setFilter] = useState(""); 
  const [newsData, setNewsData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null); // Add this for popup

  // Load More state
  const [visibleCount, setVisibleCount] = useState(6);
  const increment = 6;

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/news/") 
      .then((res) => {
        console.log("News data received:", res.data);
        // Format dates for display
        const formattedData = res.data.map(item => ({
          ...item,
          displayDate: item.date ? new Date(item.date).toLocaleDateString() : 'No date'
        }));
        setNewsData(formattedData);
      })
      .catch((err) => {
        console.error("News API Error:", err);
        setError("Failed to load news.");
      });
  }, []);

  // Get unique dates from data
  const uniqueDates = [...new Set(newsData.map((item) => item.displayDate))];

  // Filtered news
  const filteredData = filter
    ? newsData.filter((item) => item.displayDate === filter)
    : newsData;

  // Reset visibleCount when filter changes
  useEffect(() => {
    setVisibleCount(increment);
  }, [filter]);

  // Items to show
  const visibleItems = filteredData.slice(0, visibleCount);

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  return (
    <section className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="text-center bg-secondary py-20 mb-10 px-4">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
          Latest News & Updates
        </h1>
        <p className="text-lg lg:text-xl text-white max-w-2xl mx-auto">
          Stay informed about our research, projects, publications, and events.
        </p>
      </div>

      {/* Filter Section */}
      <div className="max-w-6xl mx-auto px-4 mb-10 flex justify-end">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-secondary"
        >
          <option value="">All Dates</option>
          {uniqueDates.map((date, index) => (
            <option key={index} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>

      {/* News Grid */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {visibleItems.length > 0 ? (
          visibleItems.map((news) => (
            <div
              key={news.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => setSelectedNews(news)} // Add click handler
            >
              {news.image && (
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-secondary">
                  {news.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4">{news.displayDate}</p>
                <p className="text-gray-700 mb-4 line-clamp-3"> {/* Changed from description to content */}
                  {news.content || "No content available"}
                </p>
                <button className="text-primary hover:text-secondary font-medium">
                  Read More →
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">
            {newsData.length === 0 ? "No news available." : "No news available for the selected date."}
          </p>
        )}
      </div>

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

      {/* ================= News Popup Modal ================= */}
      {selectedNews && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn p-4"
          onClick={() => setSelectedNews(null)} // Close when clicking backdrop
        >
          <div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-zoomIn"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-10"
            >
              ×
            </button>

            <div className="p-6">
              {selectedNews.image && (
                <img
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-2xl font-semibold text-secondary mb-2">
                {selectedNews.title}
              </h2>
              <p className="text-sm text-gray-500 mb-4">{selectedNews.displayDate}</p>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedNews.content || "No content available."}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}