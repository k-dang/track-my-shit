import { useState } from 'react';
import { useStock } from '../../context/StockContext';

// components
import { Line, Bar } from 'react-chartjs-2';
import CustomToggleButton from '../mui-overrides/CustomToggleButton';
import CustomToggleButtonGroup from '../mui-overrides/CustomToggleButtonGroup';
import PortfolioTable from '../PortfolioTable';
import PortfolioDetails from '../PortfolioDetails';
import { Grid, Container, Alert, Typography } from '@mui/material';
import CenteredProgress from '../CenteredProgress';
import MissingData from '../MissingData';
import './Portfolio.css';

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

const Portfolio = () => {
  const [alignment, setAlignment] = useState('year');
  const [startingWeek, setStartingWeek] = useState(0);
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
    localDataExists,
  } = useStock();

  if (!localDataExists) {
    return <MissingData />;
  }

  if (status === 'idle' || status === 'pending') {
    return <CenteredProgress />;
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

  const holdingsMarket = Object.keys(holdings).reduce((previous, key) => {
    return [...previous, holdings[key].marketPrice * holdings[key].quantity];
  }, []);
  const holdingsAverage = Object.keys(holdings).reduce((previous, key) => {
    return [...previous, holdings[key].averagePrice * holdings[key].quantity];
  }, []);
  const holdingsGraphData = {
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

  const lastBalance = balances[balances.length - 1];
  const totalDividends = dividends.reduce((p, c) => p + c);

  const handleChange = async (event, newValue) => {
    setAlignment(newValue);
    switch (newValue) {
      case '3month':
        setStartingWeek(39);
        break;
      case 'year':
        setStartingWeek(0);
        break;
      default:
        setStartingWeek(0);
    }
  };

  return (
    <Grid container spacing={2} className="portfolio-container">
      <Grid item xs={10}>
        <Typography variant="h4" color="textPrimary">
          Portfolio
        </Typography>
      </Grid>

      <Grid item xs={12} className="row-center">
        <PortfolioDetails
          lastBalance={lastBalance}
          totalInvested={totalInvested}
          realizedGains={realizedGains}
          totalDividends={totalDividends}
        />
      </Grid>

      <Grid item xs={12} className="row-center">
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
        {portfolioGraphData ? (
          <Line data={portfolioGraphData} options={lineGraphOptions} />
        ) : null}
      </Grid>

      <Grid container item xs={12}>
        <Grid item xs={6}>
          {dividendsGraphData ? (
            <Bar data={dividendsGraphData} options={dividendGraphOptions} />
          ) : null}
        </Grid>

        <Grid item xs={6}>
          {holdings ? (
            <Bar data={holdingsGraphData} options={holdingsGraphOptions} />
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
