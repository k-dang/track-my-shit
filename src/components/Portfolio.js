import { useState, useEffect } from 'react';

// components
import { Line } from 'react-chartjs-2';
import Divider from './Divider';
import Number from './Number';
import './Portfolio.css';

// services
import { getDailyBalances } from '../services/portfolioService';

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
};

const Portfolio = () => {
  const [data, setData] = useState(null);
  const [lastBalance, setLastBalance] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [realizedGains, setRealizedGains] = useState(0);
  const [portfolio, setPortfolio] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const { portfolio, totalInvested, realizedGains, labels, balances } =
        await getDailyBalances();
      setLastBalance(balances[balances.length - 1]);
      setRealizedGains(realizedGains);
      setTotalInvested(totalInvested);
      setPortfolio(portfolio);
      setData({
        labels: labels,
        datasets: [
          {
            label: 'Value',
            data: balances,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      });
    };
    fetchData();
  }, []);

  const openPL = (lastBalance - totalInvested).toFixed(2);
  const overallPL = (lastBalance - totalInvested + realizedGains).toFixed(2);

  return (
    <div className="chart">
      <div className="header-row">
        <div className="row-item">
          Portfolio Value
          <Number number={lastBalance.toFixed(2)}></Number>
        </div>
        <Divider />
        <div className="row-item">
          Open P&L
          <Number number={openPL} neutral={false}></Number>
          <Number
            number={((openPL / totalInvested) * 100).toFixed(2)}
            neutral={false}
            isPercent={true}
            isSmall={true}
          ></Number>
        </div>
        <Divider></Divider>
        <div className="row-item">
          Overall P&L
          <Number number={overallPL} neutral={false}></Number>
          <Number
            number={((overallPL / totalInvested) * 100).toFixed(2)}
            neutral={false}
            isPercent={true}
            isSmall={true}
          ></Number>
        </div>
      </div>
      {data ? <Line data={data} options={options} /> : null}

      <table className="portfolio-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Shares</th>
            <th>Market Price</th>
            <th>Average Price</th>
            <th>Market Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(portfolio).map((key, i) => (
            <tr key={i}>
              <td>{key}</td>
              <td>{portfolio[key]['quantity']}</td>
              <td>{portfolio[key]['marketPrice']}</td>
              <td>{portfolio[key]['averagePrice'].toFixed(2)}</td>
              <td>
                {(portfolio[key]['marketPrice'] * portfolio[key]['quantity']).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Portfolio;
