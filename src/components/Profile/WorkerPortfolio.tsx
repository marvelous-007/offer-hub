import React, { useState } from "react";

const portfolioItems = [
  { id: 1, category: "Website Design", image: "https://admin.12grids.com/uploads/blogs/original_cover_images/Webp/Future_Of_Responsive_Web_Design_12Grids.webp", title: "Website 1" },
  { id: 2, category: "Certifications", image: "https://ucarecdn.com/7ce39035-fe9b-407b-8f04-8d0d8f1d1fdf/-/format/auto/-/preview/750x750/-/quality/lighter/scrum-bridge.png", title: "Certification 1" },
  { id: 3, category: "Logo", image: "https://cdn.pixabay.com/photo/2017/03/16/21/18/logo-2150297_640.png", title: "Logo 1" },
  { id: 4, category: "Others", image: "https://d2a5isokysfowx.cloudfront.net/wp-content/uploads/2020/11/soft-skills-para-programadores-1.png", title: "Other 1" },
  { id: 5, category: "Website Design", image: "https://99designs-blog.imgix.net/blog/wp-content/uploads/2022/01/104228210.jpg?auto=format&q=60&w=1280&h=960&fit=crop&crop=faces", title: "Website 2" },
  { id: 6, category: "Logo", image: "https://www.ag5.com/wp-content/uploads/2018/11/What-are-skills-header.png", title: "Logo 2" },
];

const WorkerPortfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");

    const categoryCounts = portfolioItems.reduce<Record<string, number>>((counts, item) => {
        counts[item.category] = (counts[item.category] || 0) + 1;
        return counts;
    }, {});
  
    const allCount = portfolioItems.length;

    const filteredItems =
        activeCategory === "All"
        ? portfolioItems
        : portfolioItems.filter((item) => item.category === activeCategory);

    return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
      <div className="flex gap-2 mb-4">
        {[
          { label: "All", count: allCount },
          { label: "Website Design", count: categoryCounts["Website Design"] || 0 },
          { label: "Certifications", count: categoryCounts["Certifications"] || 0 },
          { label: "Logo", count: categoryCounts["Logo"] || 0 },
          { label: "Others", count: categoryCounts["Others"] || 0 },
        ].map(({ label, count }) => (
          <button
            key={label}
            onClick={() => setActiveCategory(label)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
              activeCategory === label
                ? "bg-teal-950 text-white shadow-md"
                : "bg-teal-700 text-white border-gray-300 hover:bg-teal-800"
            }`}
          >
            {`${label} (${count})`}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-4 md:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="relative group border rounded-lg overflow-hidden shadow-sm hover:shadow-md"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-sm font-medium">
                {item.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkerPortfolio;
