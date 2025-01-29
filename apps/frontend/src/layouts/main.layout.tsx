import React from "react";
import Sidebar from "../components/Sidebar.component";
import TopNavBar from "../components/TopNavBar.component";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-50">
        <TopNavBar />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
