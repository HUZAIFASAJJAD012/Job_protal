import { Link } from "react-router-dom";

export function BlogCard({ post }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-md transition-shadow border-4 border-white max-w-[600px] mx-auto w-full">
      {/* Responsive Image Container */}
      <div className="w-full aspect-[4/3] sm:aspect-[16/9]">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text Content */}
      <div className="p-4 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 line-clamp-2">
          {post.title}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-2">
          {post.description}
        </p>
        <Link
          to={post.link}
          className="text-green-600 hover:text-green-700 font-medium transition-colors"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}
