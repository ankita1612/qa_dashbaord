import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FiHome,
  FiUpload,
  FiUser,
  FiChevronDown,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import logo from "/path-to-your-logo.png"; // Update with your logo path
import Header from "./Header"; // Update with your Header component path
import Footer from "./Footer"; // Update with your Footer component path
import Breadcrumb from "./Breadcrumb"; // Update with your Breadcrumb component path

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`
          bg-[#3F4D67] text-gray-200 flex flex-col shadow-xl
          transition-all duration-300 ease-in-out
          ${
            isMobile
              ? `fixed top-0 left-0 h-full z-50 w-64 transform ${
                  sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : sidebarOpen
                ? "w-64"
                : "w-20 hover:w-64 group transition-all duration-300"
          }
        `}
      >
        {/* Logo */}
        <div className="flex items-center h-20 px-4 bg-[#2A374D] border-b border-[#4A5A78]">
          <div className="flex items-center gap-3">
            {/* Logo Icon */}
            <div className="flex items-center justify-center w-12 h-12 overflow-hidden shadow-lg bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl">
              <img
                src={logo}
                alt="App logo"
                className="object-contain w-10 h-10"
              />
            </div>

            {/* Text - with animation for collapsed state */}
            <div
              className={`
                overflow-hidden transition-all duration-300
                ${sidebarOpen || isMobile ? "max-w-48 opacity-100" : "max-w-0 opacity-0"}
              `}
            >
              <div className="flex flex-col leading-tight">
                <span className="text-base font-bold tracking-wide text-white">
                  Actowiz
                </span>
                <span className="text-[10px] text-blue-300 font-medium">
                  QA Tool
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto group">
          {/* Dashboard Link */}
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center ${
                sidebarOpen || isMobile
                  ? "justify-start px-3"
                  : "justify-center px-2"
              } gap-3 py-2.5 rounded-xl transition-all duration-200 group relative
              ${
                isActive
                  ? "bg-[#2A374D] text-white shadow-md"
                  : "text-gray-300 hover:bg-[#2A374D]/50 hover:text-white"
              }`
            }
          >
            <FiHome size={20} className="flex-shrink-0" />
            {sidebarOpen || isMobile ? (
              <span className="text-sm font-medium">Dashboard</span>
            ) : (
              /* Tooltip for collapsed state */
              <span className="absolute z-50 px-2 py-1 ml-2 text-xs text-white transition-opacity bg-gray-800 rounded-md opacity-0 pointer-events-none left-full group-hover:opacity-100 whitespace-nowrap">
                Dashboard
              </span>
            )}
          </NavLink>

          {/* Upload File Link */}
          <NavLink
            to="/admin/import_file"
            className={({ isActive }) =>
              `flex items-center ${
                sidebarOpen || isMobile
                  ? "justify-start px-3"
                  : "justify-center px-2"
              } gap-3 py-2.5 rounded-xl transition-all duration-200 group relative
              ${
                isActive
                  ? "bg-[#2A374D] text-white shadow-md"
                  : "text-gray-300 hover:bg-[#2A374D]/50 hover:text-white"
              }`
            }
          >
            <FiUpload size={20} className="flex-shrink-0" />
            {sidebarOpen || isMobile ? (
              <span className="text-sm font-medium">Upload File</span>
            ) : (
              <span className="absolute z-50 px-2 py-1 ml-2 text-xs text-white transition-opacity bg-gray-800 rounded-md opacity-0 pointer-events-none left-full group-hover:opacity-100 whitespace-nowrap">
                Upload File
              </span>
            )}
          </NavLink>

          {/* User Management Menu */}
          <div className="mt-4 pt-2 border-t border-[#4A5A78]">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`
                w-full flex items-center 
                ${
                  sidebarOpen || isMobile
                    ? "justify-between px-3"
                    : "justify-center px-2"
                } 
                py-2.5 rounded-xl transition-all duration-200 
                text-gray-300 hover:bg-[#2A374D]/50 hover:text-white 
                group relative
              `}
            >
              <div className="flex items-center gap-3">
                <FiUser size={20} className="flex-shrink-0" />
                {(sidebarOpen || isMobile) && (
                  <span className="text-sm font-medium">User Management</span>
                )}
                {!sidebarOpen && !isMobile && (
                  <span className="absolute z-50 px-2 py-1 ml-2 text-xs text-white transition-opacity bg-gray-800 rounded-md opacity-0 pointer-events-none left-full group-hover:opacity-100 whitespace-nowrap">
                    User Management
                  </span>
                )}
              </div>
              {(sidebarOpen || isMobile) && (
                <FiChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {/* Submenu */}
            {(sidebarOpen || isMobile) && userMenuOpen && (
              <div className="mt-1 ml-8 space-y-1 overflow-hidden transition-all duration-300">
                <NavLink
                  to="/admin/user/list"
                  className={({ isActive }) =>
                    `block px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-[#2A374D] text-white"
                        : "text-gray-300 hover:bg-[#2A374D]/50 hover:text-white"
                    }`
                  }
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    User List
                  </div>
                </NavLink>
                <NavLink
                  to="/admin/user/add"
                  className={({ isActive }) =>
                    `block px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-[#2A374D] text-white"
                        : "text-gray-300 hover:bg-[#2A374D]/50 hover:text-white"
                    }`
                  }
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    Add User
                  </div>
                </NavLink>
              </div>
            )}
          </div>

          {/* Sidebar Footer - User Profile */}
          <div className="pt-4 mt-4 border-t border-[#4A5A78]">
            <div
              className={`
                flex items-center 
                ${sidebarOpen || isMobile ? "gap-3 px-3" : "justify-center px-2"} 
                py-2 rounded-xl transition-all duration-200
                hover:bg-[#2A374D]/50 group relative
              `}
            >
              {/* Avatar */}
              <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500">
                <span className="text-xs font-bold text-white">A</span>
              </div>

              {/* User Info - Only show when sidebar is open */}
              {(sidebarOpen || isMobile) && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      Admin User
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      admin@actowiz.com
                    </p>
                  </div>
                  <button className="p-1 text-gray-400 transition hover:text-white">
                    <FiLogOut size={16} />
                  </button>
                </>
              )}

              {/* Tooltip for collapsed state */}
              {!sidebarOpen && !isMobile && (
                <span className="absolute z-50 px-2 py-1 ml-2 text-xs text-white transition-opacity bg-gray-800 rounded-md opacity-0 pointer-events-none left-full group-hover:opacity-100 whitespace-nowrap">
                  Admin User
                </span>
              )}
            </div>
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 duration-200 bg-black/50 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 bg-gray-50">
        <Header />

        <div className="flex flex-col flex-1">
          {/* Content */}
          <main className="flex-1 p-4 overflow-y-auto md:p-6 lg:p-8">
            <div className="w-full mx-auto max-w-7xl">
              <Breadcrumb />
              <Outlet />
            </div>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>

      {/* Mobile Toggle Button */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-3 bg-[#3F4D67] text-white rounded-full shadow-lg hover:bg-[#2A374D] transition-all duration-200 md:hidden"
        >
          <FiMenu size={24} />
        </button>
      )}
    </div>
  );
};

export default AdminLayout;
