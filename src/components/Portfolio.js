import { useState, useEffect } from 'react';

// components
import './Portfolio.css';
import { Line, Bar } from 'react-chartjs-2';
import CustomToggleButton from './mui-overrides/CustomToggleButton';
import CustomToggleButtonGroup from './mui-overrides/CustomToggleButtonGroup';
import PortfolioTable from './PortfolioTable';
import PortfolioDetails from './PortfolioDetails';
import { Grid, Typography } from '@mui/material';

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

  const handleChange = async (event, newValue) => {
    if (newValue != null) {
      console.log(newValue);
      setAlignment(newValue);
      // TODO handle later
      // await getMonthlyBalances();
    }
  };

  return (
    <div className="portfolio-container">
      <PortfolioDetails
        lastBalance={lastBalance}
        totalInvested={totalInvested}
        realizedGains={realizedGains}
      />

      <Typography variant="h4" color="textPrimary">
        Portfolio
      </Typography>
      {data ? <Line data={data} options={lineOptions} /> : null}

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="h4" color="textPrimary">
            Dividends
          </Typography>
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
