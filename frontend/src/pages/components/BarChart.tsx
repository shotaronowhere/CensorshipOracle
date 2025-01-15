import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, TimeScale, LinearScale, BarElement, LineElement, ChartOptions, PointElement} from "chart.js";
import { Scatter } from "react-chartjs-2";
import 'chartjs-adapter-moment';
import { type SubgraphData} from "../../types"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, TimeScale, BarElement, LineElement, PointElement);

const formatToDailyChart = (isDay: boolean, dataset: SubgraphData) => {
 console.log(dataset)
 console.log('yoyoyo')
  if (!dataset || dataset.blockRangeDaily.length === 0) {
    return {
      data: [],
      labels: []
    }
  }

  const labels : string[]= []
  const data: {x: number, y: number}[] = []

  const dataMap = isDay ? dataset.blockRangeDaily : dataset.blockRangeMonthly

  for (let i=0; i<dataMap.length; i++) {
    const tsHigh = Number(dataMap[i]?.blockTimestampHigh)
    const percentMissing = Number(dataMap[i]?.percentMissing)/100
    // Percentage of missing blocks in 24 hours
    data.push({x: tsHigh * 1000, y: percentMissing})
  }

  return {
    data,
    labels
  }
}

interface IBarChartProps {
  isDay: boolean,
  dataset_eth: SubgraphData,
  dataset_gnosis: SubgraphData
}

const BarChart = (props : IBarChartProps) => {
  const dailychartdata = formatToDailyChart(props.isDay, props.dataset_eth);
  const data_eth = dailychartdata.data
  const dailychartdata_gnosis = formatToDailyChart(props.isDay, props.dataset_gnosis)
  const data_gnosis = dailychartdata_gnosis.data

  const chartData = {
    datasets: [

      {
        label: "Gnosis",
        backgroundColor: "rgb(0, 102, 51)",
        borderColor: "rgb(0, 102, 51)",
        data: data_gnosis ,
        showLine: true,
        xAxisID: 'x1',
        yAxisID: 'y1'
      },{
        label: "Ethereum",
        backgroundColor: "rgb(0, 0, 0)",
        borderColor: "rgb(0, 0, 0)",
        data: data_eth ,
        showLine: true,
        xAxisID: 'x1',
        yAxisID: 'y1'
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x1: {
        type: 'time',
        title: {
          display: true,
        },
      },
        y1: {
          title: {
            display: true,
            text: 'Missing Blocks [%]'
          }
        }
    },
   }

  return (
    <div className="w-3/4 block">
      { data_eth.length === 0
          ? "Unable to load data"
          : <div id="canvas-container"><Scatter options={options as ChartOptions} data={chartData} /></div>
      }
    </div>
  )
}

export default BarChart