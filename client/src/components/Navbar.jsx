import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between">
      <Link to="/" className="text-xl font-bold text-blue-600">
        FoodShare
      </Link>

      <div className="flex gap-4">
        {!user && (
          <>
            <Link to="/login" className="text-blue-600">Login</Link>
            <Link to="/register" className="text-blue-600">Register</Link>
          </>
        )}

        {user && (
          <>
            <Link to="/create" className="text-blue-600">Create Post</Link>
            <button
              onClick={logout}
              className="text-red-500 font-medium"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
