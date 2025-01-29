import React from 'react';
import { Carousel } from 'antd';

const contentStyle: React.CSSProperties = {
    height: "100vh", // Full page height
    color: "#fff",
    lineHeight: '160px',
    textAlign: 'center',
    backgroundColor: "rgb(37, 99, 235)", // Equivalent to Tailwind's bg-blue-600
  };
  

const CarouselComponent: React.FC = () => (
  <Carousel autoplay>
    <div>
      <h3 style={contentStyle}>1</h3>
    </div>
    <div>
      <h3 style={contentStyle}>2</h3>
    </div>
    <div>
      <h3 style={contentStyle}>3</h3>
    </div>
    <div>
      <h3 style={contentStyle}>4</h3>
    </div>
  </Carousel>
);

export default CarouselComponent;