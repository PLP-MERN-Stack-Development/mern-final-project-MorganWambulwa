export default function PostCard({ post }) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <img
          src={post.imageUrl}
          className="h-48 w-full object-cover rounded-md"
          alt={post.title}
        />
  
        <h3 className="text-xl font-semibold mt-2">{post.title}</h3>
        <p className="text-gray-600">{post.description}</p>
  
        <div className="mt-2 text-sm">
          <span className="font-medium text-green-600">{post.status}</span>
        </div>
      </div>
    );
  }
  