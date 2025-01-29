import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 flex items-center justify-center bg-blue-600">
        {/* You can add branding, an image, or any relevant content here */}
        <h1 className="text-white text-4xl font-bold">Welcome Back!</h1>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-6">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
