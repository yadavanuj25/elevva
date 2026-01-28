import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Header from "../components/layouts/Header";
import Sidebar from "../components/layouts/Sidebar";
import "../assets/styles/style.css";
import Footer from "../components/layouts/Footer";
import AdminLayoutSkeleton from "../components/loaders/skeletons/AdminLayoutSkeleton";

const Layout = () => {
  const { loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return <AdminLayoutSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col transition-all duration-300">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          sidebarOpen ? "md:ml-60" : "md:ml-16"
        }`}
      >
        <Header toggleSidebar={toggleSidebar} isOpen={sidebarOpen} />
        <main className="flex-1 p-4 overflow-auto ">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
