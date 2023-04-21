import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const BarChart = () => {
  const labels = ["Merge", "+2 Months", "+4 Months", "+6 months", "Shapella"];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Ethereum",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: [1.24, 0.66, 0.55, 0.91, 4.96],
      },
      {
        label: "Gnosis",
        backgroundColor: "rgb(1, 121, 111)",
        borderColor: "rgb(1, 121, 111)",
        data: [4.33, 4.01, 4.75],
      }
    ],
  };
  return (
    <div className="w-3/4 block">
      {/* <h1 className="text-xl"> Missing blocks </h1> */}
      <Bar data={data} />
    </div>
  );
};

export default BarChart;