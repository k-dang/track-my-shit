import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStock } from '../../context/StockContext';

// components
import { Line, Bar } from 'react-chartjs-2';
import CustomToggleButton from '../mui-overrides/CustomToggleButton';
import CustomToggleButtonGroup from '../mui-overrides/CustomToggleButtonGroup';
import PortfolioTable from '../PortfolioTable';
import PortfolioDetails from '../PortfolioDetails';
import { Grid, CircularProgress, Container, Alert } from '@mui/material';
import './Portfolio.css';

const lineOptions = {
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

const holdingsOptions = {
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

const Portfolio = () => {
  const [alignment, setAlignment] = useState('3month');
  const location = useLocation();
  const {
    stockData: {
      holdings,
      totalInvested,
      realizedGains,
      labels,
      balances,
      dividends,
    },
    status,
  } = useStock();

  if (status === 'idle') {
    return <Navigate to="/" state={{ from: location }} />;
  }

  if (status === 'pending') {
    return (
      <Container className="center-container">
        <CircularProgress />
      </Container>
    );
  }

  if (status === 'rejected') {
    return (
      <Container>
        <Alert variant="outlined" severity="error">
          There was an issue getting portfolio data
        </Alert>
      </Container>
    );
  }

  const portfolioGraphData = {
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
  };

  const lastBalance = balances[balances.length - 1];
  const dividendsGraphData = {
    labels: labels,
    datasets: [
      {
        label: 'Dividends',
        data: dividends,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };
  const totalDividends = dividends.reduce((p, c) => p + c);

  const holdingsMarket = Object.keys(holdings).reduce((previous, key) => {
    return [...previous, holdings[key].marketPrice * holdings[key].quantity];
  }, []);
  const holdingsAverage = Object.keys(holdings).reduce((previous, key) => {
    return [...previous, holdings[key].averagePrice * holdings[key].quantity];
  }, []);
  const holdingsData = {
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

  const handleChange = async (event, newValue) => {
    console.log(newValue);
    setAlignment(newValue);
    // TODO handle later
  };

  return (
    <Grid container spacing={2} className="portfolio-container">
      <Grid item xs={12}>
        <PortfolioDetails
          lastBalance={lastBalance}
          totalInvested={totalInvested}
          realizedGains={realizedGains}
          totalDividends={totalDividends}
        />
      </Grid>

      <Grid item xs={12}>
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
      </Grid>

      <Grid item xs={12}>
        {portfolioGraphData ? <Line data={portfolioGraphData} options={lineOptions} /> : null}
      </Grid>

      <Grid container item xs={12}>
        <Grid item xs={6}>
          {dividendsGraphData ? (
            <Bar data={dividendsGraphData} options={dividendGraphOptions} />
          ) : null}
        </Grid>

        <Grid item xs={6}>
          {holdings ? (
            <Bar data={holdingsData} options={holdingsOptions} />
          ) : null}
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <PortfolioTable holdings={holdings} />
      </Grid>
    </Grid>
  );
};

export default Portfolio;
