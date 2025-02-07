import React from "react";
import Sidebar from "../components/Sidebar.component";
import TopNavBar from "../components/TopNavBar.component";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 bg-white border-r shadow-sm z-10">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 ml-64">
        {/* Top Navigation */}
        <div className="fixed top-0 left-64 right-0 h-16 bg-white shadow-sm z-10">
          <TopNavBar />
        </div>

        {/* Scrollable Content */}
        <div className="mt-16 overflow-auto h-[calc(100vh-4rem)] p-6 bg-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;