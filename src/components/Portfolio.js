import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStock } from '../context/StockContext';

// components
import { Line, Bar } from 'react-chartjs-2';
import CustomToggleButton from './mui-overrides/CustomToggleButton';
import CustomToggleButtonGroup from './mui-overrides/CustomToggleButtonGroup';
import PortfolioTable from './PortfolioTable';
import PortfolioDetails from './PortfolioDetails';
import {
  Grid,
  Typography,
  CircularProgress,
  Container,
  Alert,
} from '@mui/material';
import './Portfolio.css';

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
  const [alignment, setAlignment] = useState('3month');
  const location = useLocation();
  const {
    stockData: {
      portfolio,
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
      <Container>
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

  const graphData = {
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
  const dividendsData = {
    labels: labels,
    datasets: [
      {
        label: 'Dividends',
        data: dividends,
        backgroundColor: 'rgb(54, 162, 235)',
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
        <Typography variant="h4" color="textPrimary">
          Portfolio
        </Typography>
        {graphData ? <Line data={graphData} options={lineOptions} /> : null}
      </Grid>

      <Grid item xs={12}>
        <Grid item xs={6}>
          <Typography variant="h4" color="textPrimary">
            Dividends
          </Typography>
          {dividendsData ? (
            <Bar data={dividendsData} options={barOptions} />
          ) : null}
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <PortfolioTable portfolio={portfolio} />
      </Grid>
    </Grid>
  );
};

export default Portfolio;
