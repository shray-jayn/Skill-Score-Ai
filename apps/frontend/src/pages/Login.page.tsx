import React from "react";
import { Carousel} from "antd";
import LoginComponent from "../components/Login.component";

const images = [
  '/image1.jpg',
  '/image2.jpg',
  '/image3.jpg',
  '/image4.jpg',
  '/image5.jpg',
];

const Login: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Carousel Section */}
      <div className="w-1/2 h-screen">
        <Carousel autoplay effect="fade" className="h-full">
          {images.map((src, index) => (
            <div key={index} className="h-screen">
              <img src={src} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Login Section */}
      <div className="w-1/2 flex items-center justify-center h-screen">
        <div className="max-w-md w-full p-6">
          <LoginComponent />
        </div>
      </div>
    </div>
  );
};

export default Login;
