import { useState, useEffect } from 'react';

// components
import { Line, Bar } from 'react-chartjs-2';
import Divider from './Divider';
import Number from './Number';
import './Portfolio.css';
import CustomToggleButton from './CustomToggleButton';
import CustomToggleButtonGroup from './CustomToggleButtonGroup';
import PortfolioTable from './PortfolioTable';

// services
import {
  getDailyBalances,
  getMonthlyBalances,
} from '../services/portfolioService';

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
};

const barOptions = {
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
  const [alignment, setAlignment] = useState(false);
  const [dividends, setDividends] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const {
        portfolio,
        totalInvested,
        realizedGains,
        labels,
        balances,
        dividends,
      } = await getDailyBalances();
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

      setDividends({
        labels: labels,
        datasets: [
          {
            label: 'Dividends',
            data: dividends,
            backgroundColor: 'rgb(54, 162, 235)',
          },
        ],
      });
    };
    fetchData();
  }, []);

  const openPL = (lastBalance - totalInvested).toFixed(2);
  const overallPL = (lastBalance - totalInvested + realizedGains).toFixed(2);

  const handleChange = async (event, newValue) => {
    if (newValue != null) {
      console.log(newValue);
      setAlignment(newValue);
      // await getMonthlyBalances();
    }
  };

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
        <Divider />
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
      <h2>Portfolio</h2>
      {data ? <Line data={data} options={options} /> : null}

      <h2>Dividends</h2>
      {dividends ? <Bar data={dividends} options={barOptions} /> : null}

      <CustomToggleButtonGroup
        color="primary"
        size="small"
        value={alignment}
        exclusive
        onChange={handleChange}
      >
        <CustomToggleButton value="default">3M</CustomToggleButton>
        <CustomToggleButton value="year">1Y</CustomToggleButton>
      </CustomToggleButtonGroup>

      <PortfolioTable portfolio={portfolio} />
    </div>
  );
};

export default Portfolio;
