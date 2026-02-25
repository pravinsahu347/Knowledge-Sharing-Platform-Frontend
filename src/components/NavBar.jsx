import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-ink-800 border-b border-ink-600 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="font-display text-xl text-amber-accent">
        Knowledge AI
      </Link>

      <div className="space-x-6">
        {user ? (
          <>
            <Link to="/create" className="hover:text-amber-light">
              New Article
            </Link>

            <Link to="/dashboard" className="hover:text-amber-light">
              My Articles
            </Link>

            <button
              onClick={logout}
              className="text-slate hover:text-amber-light"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;