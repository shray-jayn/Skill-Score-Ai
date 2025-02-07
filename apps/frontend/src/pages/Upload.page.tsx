import React from "react";
import MainLayout from "../layouts/main.layout";
import UploadComponent from "../components/Upload.component";

const Upload: React.FC = () => {
  return (
    <MainLayout>      
      <div>
        {/* <h2 className="text-2xl font-semibold text-gray-700 mb-4">Upload</h2> */}
        <UploadComponent/>
      </div>
    </MainLayout>
  );
};

export default Upload;
