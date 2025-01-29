import React from "react";
import SignUpComponent from "../components/SignUp.component";

const SignUp: React.FC = () => {
  return (
    <div className="flex h-screen">

   
    <div className="w-1/2 flex items-center justify-center bg-blue-600">
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          <SignUpComponent/>
        </div>
      </div>

    </div>


  );
};

export default SignUp;
