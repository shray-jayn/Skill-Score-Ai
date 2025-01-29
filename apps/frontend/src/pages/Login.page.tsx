import React from "react";
import LoginComponent from "../components/Login.component";

const Login: React.FC = () => {
  return (
    <div className="flex h-screen">

      <div className="w-1/2 flex items-center justify-center bg-blue-600">
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          <LoginComponent />
        </div>
      </div>

    </div>


  );
};

export default Login;
