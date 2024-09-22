// Import necessary libraries and components
import react, { useContext } from "react"; // React library and useContext hook
import Auth from "./components/Auth"; // Auth component for user authentication
import Profile from "./components/Profile"; // Profile component for user profile
import Public from "./components/Public"; // Public component for public content
import Navbar from "./components/Navbar"; // Navbar component for navigation
import { Routes, Route, Navigate } from "react-router-dom"; // Routing components from react-router-dom
import { UserContext } from "./context/UserProvider"; // UserContext for managing user state

// Define the main App component
export default function App() {
  // Use UserContext to get the token and logout function
  const { token, logout } = useContext(UserContext);

  return (
    <>
      {/* Render the Navbar only if the user is authenticated (has a token) */}
      {token && <Navbar logout={logout} />}
      <div id="app">
        {/* Set up routing for the application */}
        <Routes>
          {/* Root route redirects to /profile if logged in, otherwise shows Auth component */}
          <Route
            path="/"
            element={token ? <Navigate to="/profile" /> : <Auth />}
          />
          {/* Profile route: shows Profile component if logged in, otherwise redirects to Auth */}
          <Route
            path="profile"
            element={token ? <Profile /> : <Navigate to="/" />}
          />
          {/* Public route: shows Public component if logged in, otherwise redirects to Auth */}
          <Route
            path="public"
            element={token ? <Public /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </>
  );
}
