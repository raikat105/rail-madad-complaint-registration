import React from "react";
import Navbar from "../src/components/Navbar";
// import Footer from "../src/components/Footer";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import { useAuth } from "./context/AuthProvider"; // Import useAuth hook
import { Toaster } from "react-hot-toast";
import Body from "./Home/Body";
import Dashboard from "./Home/Dashboard";
import Contact from "./Home/Contact";
// import Chat from "./Home/Chat";
import Form from "./Home/Form";
import Home from "./Home/Home";
import ComplaintStatusPage from "./Home/ComplaintStatusPage";

function App() {
  const location = useLocation();
  const { isAuthenticated } = useAuth(); // Get the authentication status

  // Adjusted condition for hiding Navbar and Footer
  const hideNavbarFooter = ["/dashboard", "/login", "/register"].some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div>
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated === true ? (
              <>
                <Body />
                <Home />
                {/* <Chat /> */}
              </>
            ) : isAuthenticated === false ? (
              <Navigate to={"/login"} />
            ) : (
              <div>Loading...</div>
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<><Body /> <Dashboard /></>} />
        <Route path="/contact" element={<><Body /> <Contact /></>} />
        <Route path="/feed" element={<><Body /></>} />
        <Route path="/complaints" element={<><Body /> <Form /></>} />
        <Route path="/current-complaint-status" element={<><Body /><ComplaintStatusPage /></>} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
      <Toaster />
      {/* {!hideNavbarFooter && <Footer />} */}
    </div>
  );
}

export default App;
