import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, TimeScale, LinearScale, BarElement, LineElement, PointElement} from "chart.js";
import { Scatter } from "react-chartjs-2";
import 'chartjs-adapter-moment';
import { type BlockRange} from "../../types"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, TimeScale, BarElement, LineElement, PointElement);

const formatToDailyChart = (is30days: boolean, chainid: number, dataset: BlockRange[]) => {
 
  if (!dataset || dataset.length === 0) {
    return {
      data: [],
      labels: []
    }
  }

  const labels : string[]= []
  const data: {x: number, y: number}[] = []


  if (is30days){
    const total = chainid === 100 ? 70 : 30
    for (let i=dataset.length-1; i>dataset.length-total; i--) {
      const tsLow = Number(dataset[i]?.blockTimestampLow)
      const tsHigh = Number(dataset[i]?.blockTimestampHigh)
      const blockNumberLow = Number(dataset[i]?.blockNumberLow)
      const blockNumberHigh = Number(dataset[i]?.blockNumberHigh)
      const missingBlocks = Number(dataset[i]?.missingBlocks)
      // Percentage of missing blocks in 24 hours
      data.push({x: (tsHigh + tsLow)*1000/2, y: missingBlocks / (blockNumberHigh - blockNumberLow + missingBlocks) * 100})
    }
  } else {
    const sortedDataset = dataset.sort((a, b) => Number(a.blockTimestampHigh) - Number(b.blockTimestampHigh))
    const pointsperday = chainid === 100 ? 14 : 7
    // Convert each pointsperday items into a day data point
    for (let i=0; i<sortedDataset.length; i+=pointsperday) {
      const temp = i + pointsperday < dataset.length
        ? sortedDataset.slice(i, i+pointsperday)
        : sortedDataset.slice(i)

      const missingBlocks = temp.reduce(
        (accumulator, currentBlockRange) => accumulator + Number(currentBlockRange.missingBlocks),
        0
      )

      const tsLow = Number(temp[0]?.blockTimestampLow)
      const tsHigh = Number(temp[temp.length - 1]?.blockTimestampHigh)
      const blockNumberLow = Number(temp[0]?.blockNumberLow)
      const blockNumberHigh = Number(temp[temp.length - 1]?.blockNumberHigh)

      // Percentage of missing blocks in 24 hours
      data.push({x: (tsHigh + tsLow)*1000/2, y: missingBlocks / (blockNumberHigh - blockNumberLow + missingBlocks) * 100})
    }
  }

  return {
    data,
    labels
  }
}

interface IBarChartProps {
  freq: number,
  testnet: boolean,
  dataset_eth: BlockRange[],
  dataset_gnosis: BlockRange[]
}

const BarChart = (props : IBarChartProps) => {
  const dailychartdata = formatToDailyChart(props.freq !=7,props.testnet? 5: 1, props.dataset_eth);
  const data_eth = dailychartdata.data
  const dailychartdata_gnosis = formatToDailyChart(props.freq !=7,props.testnet? 10200: 100, props.dataset_gnosis)
  const data_gnosis = dailychartdata_gnosis.data

  const chartData = {
    datasets: [

      {
        label: props.testnet? "Chiado": "Gnosis",
        backgroundColor: "rgb(0, 102, 51)",
        borderColor: "rgb(0, 102, 51)",
        data: data_gnosis ,
        showLine: true,
        xAxisID: 'x1',
        yAxisID: 'y1'
      },{
        label: props.testnet? "Goerli": "Ethereum",
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
          : <Scatter options={options} data={chartData} />
      }
    </div>
  )
}

export default BarChart