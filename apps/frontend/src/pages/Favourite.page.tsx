import React from "react";
import MainLayout from "../layouts/main.layout";
import RecentFilesTable from "../components/FilesTable.component";

const Favourite: React.FC = () => {
  return (
    <MainLayout>      
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Reports</h2>
        <RecentFilesTable />
      </div>
    </MainLayout>
  );
};

export default Favourite;
