import { useEffect, useState } from "react";
import Slider from "react-slick";
import CountUp from "react-countup";
import Explore from "../components/Explore";
import ABOUT from "../pages/About";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const [data, setData] = useState({
    stats: [],
    images: [],
    news: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);
  const [error, setError] = useState(null);

  // Fetch data
useEffect(() => {
  const fetchData = async () => {
    try {
      console.log("🔄 Fetching data from APIs...");
      
      const [homeRes, newsRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/"),  // Home data
        fetch("http://127.0.0.1:8000/news/").catch(err => {
          console.log("⚠️ News API failed, using empty array");
          return { ok: true, json: () => [] }; // Return empty array if news fails
        }),
      ]);
      
      if (!homeRes.ok) {
        throw new Error(`Home API error: ${homeRes.status}`);
      }
      
      const homeData = await homeRes.json();
      const newsData = newsRes.ok ? await newsRes.json() : []; // Handle news failure
      
      console.log("✅ Home data received:", homeData);
      console.log("✅ News data received:", newsData);
      
      setData({
        stats: homeData.stats || [],
        images: homeData.images || [],
        news: newsData
      });
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      setError("Failed to load some data. Please try again later.");
      setLoading(false);
    }
  };
  fetchData();
}, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  // News carousel settings
  const newsSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  // Image slider settings
  const imageSliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    fade: true,
    cssEase: "linear",
  };

  return (
    <main>
      {/* ================= Hero Section ================= */}
      <section className="relative bg-secondary text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-6 space-y-8 lg:space-y-0">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <img
              src="/image/ssgi-logo.png" 
              alt="SSGI Logo"
              className="w-28 h-28 object-contain rounded-full bg-white p-2 shadow-lg"
            />
          </div>

          {/* Right: Department Title */}
          <div className="text-center lg:text-right">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-4">
              Remote Sensing <br />
              <span className="text-primary">Department</span>
            </h1>
            <p className="text-lg text-gray-200 max-w-xl lg:ml-auto">
              Advancing Earth observation science through innovative remote sensing
              technologies, research excellence, and sustainable applications.
            </p>
          </div>
        </div>

        {/* ================= Rotating News Section ================= */}
        <div className="mt-12 bg-primary/10 py-8">
          <div className="max-w-6xl mx-auto px-4">
            {data.news && data.news.length > 0 ? (
              <Slider {...newsSettings}>
                {data.news.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 cursor-pointer"
                    onClick={() => setSelectedNews(item)}
                  >
                    <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="bg-white p-3 text-center">
                        <h3 className="text-lg font-semibold text-secondary">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{item.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No recent news available.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ================= About Section ================= */}
      <ABOUT />

      {/* ================= Explore Section ================= */}
      <Explore />

      {/* ================= Stats Section ================= */}
      {data.stats && data.stats.length > 0 ? (
        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {data.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                    <CountUp
                      end={stat.number}
                      duration={3}
                      suffix={stat.is_plus ? "+" : ""}
                    />
                  </div>
                  <div className="text-xl text-gray-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-300 text-lg">Statistics will appear here once added via the dashboard</p>
          </div>
        </section>
      )}

      {/* ================= Image Slider Section ================= */}
      {data.images && data.images.length > 0 ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Slider {...imageSliderSettings}>
            {data.images.map((image, index) => (
              <div key={index} className="px-4">
                <div className="relative group rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={image.image_url}
                    alt={image.alt_text}
                    className="w-full h-72 md:h-[28rem] object-cover rounded-2xl transform transition duration-700 ease-in-out group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "/images/default-placeholder.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-70 group-hover:opacity-80 transition duration-500">
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-xl md:text-2xl font-semibold drop-shadow-md">
                        {image.alt_text}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-gray-500">Images will appear here once added via the dashboard</p>
        </div>
      )}

      {/* ================= News Popup Modal ================= */}
      {selectedNews && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn">
    <div className="bg-white rounded-2xl shadow-xl w-[90%] md:w-[700px] max-h-[90vh] overflow-y-auto relative animate-zoomIn">
      <button
        onClick={() => setSelectedNews(null)}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
      >
        ×
      </button>

      <div className="p-6">
        {selectedNews.image && (
          <img
            src={selectedNews.image}
            alt={selectedNews.title}
            className="w-full h-60 object-cover rounded-lg mb-4"
          />
        )}
        <h2 className="text-2xl font-semibold text-secondary mb-2">
          {selectedNews.title}
        </h2>
        <p className="text-sm text-gray-500 mb-4">{selectedNews.date}</p>
        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
          {selectedNews.content || "No content available."} {/* Changed from description to content */}
        </div>
      </div>
    </div>
  </div>
)}
    </main>
  );
}