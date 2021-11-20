import { useState, useEffect } from 'react';

// components
import { Line, Bar } from 'react-chartjs-2';
import Divider from './Divider';
import Number from './Number';
import './Portfolio.css';
import CustomToggleButton from './mui-overrides/CustomToggleButton';
import CustomToggleButtonGroup from './mui-overrides/CustomToggleButtonGroup';
import PortfolioTable from './PortfolioTable';
import { Grid } from '@mui/material';

// services
import {
  getDailyBalances,
  getMonthlyBalances,
} from '../services/portfolioService';
import { getDailyPricesGoApi } from '../services/goService';

const lineOptions = {
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
  const [alignment, setAlignment] = useState('3month');
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
            fill: {
              target: 'origin',
              above: 'rgba(54, 162, 235, 0.2)',
            },
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
    // getDailyPricesGoApi('AAPL');
  }, []);

  const openPL = (lastBalance - totalInvested).toFixed(2);
  const overallPL = (lastBalance - totalInvested + realizedGains).toFixed(2);

  const handleChange = async (event, newValue) => {
    if (newValue != null) {
      console.log(newValue);
      setAlignment(newValue);
      // TODO handle later
      // await getMonthlyBalances();
    }
  };

  return (
    <div className="chart">
      <div className="header-row">
        <div className="row-item">
          <span>Portfolio Value</span>
          <Number number={lastBalance.toFixed(2)}></Number>
        </div>
        <Divider />
        <div className="row-item">
          <span>Open P&L</span>
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
          <span>Overall P&L</span>
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
      {data ? <Line data={data} options={lineOptions} /> : null}

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <h2>Dividends</h2>
          {dividends ? <Bar data={dividends} options={barOptions} /> : null}
        </Grid>
      </Grid>

      <CustomToggleButtonGroup
        color="primary"
        size="small"
        value={alignment}
        exclusive
        onChange={handleChange}
      >
        <CustomToggleButton value="3month">3M</CustomToggleButton>
        <CustomToggleButton value="year">1Y</CustomToggleButton>
      </CustomToggleButtonGroup>

      <PortfolioTable portfolio={portfolio} />
    </div>
  );
};

export default Portfolio;
