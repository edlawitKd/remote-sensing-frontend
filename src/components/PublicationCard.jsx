import React from "react";

export default function PublicationCard({type, title,abstract ,authors, year, link }) {
    return (
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition duration-300 text-left space-y-2">
            <h3 className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 text-secondary bg-[#80CBC4]">{type}</h3>
            <h4 className="text-sm font-medium text-gray-700">{title}</h4>
            <p className="text-sm text-gray-600">{abstract}</p>
            <p className="text-sm text-gray-600">{authors}</p>
            <p className="text-sm text-gray-500">{year}</p>
            {link && (
                <a 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-2 px-4 py-4 text-secondary hover:text-primary transition"
                >
                    Read more  →
                </a>
            )}
        </div>
    )
}
