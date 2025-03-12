import {Link} from "react-router-dom";

export function BlogCard({ post }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-md transition-shadow border-4 border-white">
      <div className="relative h-72 max-w-[600px] w-full mx-auto">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h2>
        <p className="text-gray-600 mb-4 line-clamp-2">{post.description}</p>
        <Link
          to={post.link}
          className="text-green-600 hover:text-green-700 font-medium transition-colors"
        >
          Read More
        </Link>
      </div>
    </div>
  )
}

