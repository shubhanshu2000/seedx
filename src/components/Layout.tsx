import React, { useEffect } from "react";
import { Link, Outlet } from "react-router";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "../context/UserContext";
import VoiceAssistant from "./VoiceAssistant";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

const Layout: React.FC = () => {
  const { user, setUser } = useUser();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();
      setUser(supabaseUser);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("Logged out!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-600 p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <ul className="flex space-x-8 list-none m-0 p-0 items-center">
            <li>
              <Link
                to="/"
                className="text-white hover:text-green-200 font-semibold transition duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/marketplace"
                className="text-white hover:text-green-200 font-semibold transition duration-200"
              >
                Marketplace
              </Link>
            </li>
            <li>
              <Link
                to="/farmer-dashboard"
                className="text-white hover:text-green-200 font-semibold transition duration-200"
              >
                Farmer Dashboard
              </Link>
            </li>
            {user && (
              <li>
                <Link
                  to="/cart"
                  className="text-white hover:text-green-200 font-semibold transition duration-200"
                >
                  Cart
                </Link>
              </li>
            )}
          </ul>
          <div>
            {!user ? (
              <Link
                to="/login"
                className="text-white bg-green-700 px-4 py-2 rounded-lg hover:bg-green-800 font-semibold transition duration-200"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>
      <VoiceAssistant />
    </div>
  );
};

export default Layout;
