import { Line } from 'react-chartjs-2';

const lineGraphOptions = {
  scales: {
    yAxis: {
      min: 0,
    },
  },
  plugins: {
    title: {
      display: true,
      text: 'Overall P/L',
      font: {
        size: 16,
      },
    },
    legend: {
      display: false,
    },
  },
};

const PortfolioLineGraph = ({ labels, balances, startingWeek }) => {
  const graphData = {
    labels: labels.slice(startingWeek),
    datasets: [
      {
        label: 'Value',
        data: balances.slice(startingWeek),
        fill: {
          target: 'origin',
          above: 'rgba(54, 162, 235, 0.2)',
        },
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return <Line data={graphData} options={lineGraphOptions} />;
};

export default PortfolioLineGraph;
