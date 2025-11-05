import React from "react";
import ExploreCard from "./ExplorCard";
import { FaBookOpen, FaProjectDiagram, FaUsers, FaNewspaper } from "react-icons/fa";

export default function Explore() {
  const cardsData = [
    {
      title: "Publication and outputs",
      description: "Explore our research papers, books, and See the tools and services we provide.",
      icon: FaBookOpen,
      link: "/ServiceAndPublication",
    },
    {
      title: "Research and development",
      description: "Learn about our ongoing and past research projects.",
      icon: FaProjectDiagram,
      link: "/ServiceAndPublication",
    },
    {
      title: "Capacity Building",
      description: "PhD, MSc, and training programs we offer.",
      icon: FaUsers,
      link: "/ServiceAndPublication",
    },
    {
      title: "News",
      description: "what's new in our department.",
      icon: FaNewspaper,
      link: "/news",
    },
  ];

  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-secondary">Explore Our Department</h2>
        <p className="text-gray-600 mt-4">Discover the key areas of our work and expertise.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {cardsData.map((card, index) => (
          <ExploreCard key={index} {...card} />
        ))}
      </div>
    </section>
  );
}
