import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface ChartToImageProps {
  chartData: any;
  onImageGenerated: (imageUrl: string) => void;
}

const ChartToImage: React.FC<ChartToImageProps> = ({ chartData, onImageGenerated }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const chart = new Chart(canvasRef.current, {
        type: "bar",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: true,
        },
      });

      // Generate the base64 image after rendering
      const imageUrl = canvasRef.current.toDataURL("image/png");
      onImageGenerated(imageUrl);

      return () => {
        chart.destroy(); // Cleanup chart instance
      };
    }
  }, [chartData, onImageGenerated]);

  return <canvas ref={canvasRef} style={{ display: "none" }} />; // Hidden canvas
};

export default ChartToImage;
