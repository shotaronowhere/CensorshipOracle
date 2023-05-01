import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement} from "chart.js";
import { Bar } from "react-chartjs-2";
import { type BlockRange} from "../../types"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

  // Expect to be 720 data points per month, 24 per day
const formatToDailyChart = (dataset: BlockRange[]) => {
 
  if (!dataset || dataset.length === 0) {
    return {
      data: [],
      labels: []
    }
  }

  const labels : string[]= []
  const data: number[] = []

  const sortedDataset = dataset.sort((a, b) => Number(a.blockTimestampHigh) - Number(b.blockTimestampHigh))

  // Convert each 24 items into a day data point
  for (let i=0; i<sortedDataset.length; i+=24) {
    const temp = i + 24 < dataset.length
      ? dataset.slice(i, i+24)
      : dataset.slice(i)

    const missingBlocksIn24Hours = temp.reduce(
      (accumulator, currentBlockRange) => accumulator + Number(currentBlockRange.missingBlocks),
      0
    )

    const timestampLow = Number(temp[0]?.blockTimestampLow)
    const timestampHigh = Number(temp[temp.length - 1]?.blockTimestampHigh)

    // Percentage of missing blocks in 24 hours
    data.push(missingBlocksIn24Hours / ((timestampHigh - timestampLow) / 12) * 100)
    labels.push(new Date(timestampLow * 1000).toLocaleDateString())
  }

  return {
    data,
    labels
  }
}

interface IBarChartProps {
  dataset: BlockRange[]
}

const BarChart = (props : IBarChartProps) => {
  const { data, labels } = formatToDailyChart(props.dataset)
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Ethereum",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: data ,
      }
    ],
  }

  return (
    <div className="w-3/4 block">
      { data.length === 0 && labels.length === 0
          ? "Unable to load data"
          : <Bar data={chartData} />
      }
    </div>
  )
}

export default BarChart