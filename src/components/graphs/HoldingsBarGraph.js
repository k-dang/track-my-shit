import { Bar } from 'react-chartjs-2';

const holdingsGraphOptions = {
  plugins: {
    title: {
      display: true,
      text: 'Holdings',
      font: {
        size: 16,
      },
    },
    legend: {
      display: false,
    },
  },
};

const HoldingsBarGraph = ({ holdings }) => {
  const holdingsMarket = Object.keys(holdings).reduce((previous, key) => {
    return [...previous, holdings[key].marketPrice * holdings[key].quantity];
  }, []);
  const holdingsAverage = Object.keys(holdings).reduce((previous, key) => {
    return [...previous, holdings[key].averagePrice * holdings[key].quantity];
  }, []);

  const graphData = {
    labels: Object.keys(holdings),
    datasets: [
      {
        label: 'Market Value',
        data: holdingsMarket,
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
      },
      {
        label: 'Total Cost',
        data: holdingsAverage,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return <Bar data={graphData} options={holdingsGraphOptions} />;
};

export default HoldingsBarGraph;
