import { Bar } from 'react-chartjs-2';

const dividendGraphOptions = {
  plugins: {
    title: {
      display: true,
      text: 'Dividends',
      font: {
        size: 16,
      },
    },
    legend: {
      display: false,
    },
  },
};

const DividendBarGraph = ({ labels, dividends }) => {
  const graphData = {
    labels: labels,
    datasets: [
      {
        label: 'Dividends',
        data: dividends,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  return <Bar data={graphData} options={dividendGraphOptions} />;
};

export default DividendBarGraph;
