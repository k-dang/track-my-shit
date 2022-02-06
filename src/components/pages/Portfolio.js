import { useState } from 'react';
import { useStock } from '../../context/StockContext';

// components
import PortfolioLineGraph from '../graphs/PortfolioLineGraph';
import DividendBarGraph from '../graphs/DividendBarGraph';
import HoldingsBarGraph from '../graphs/HoldingsBarGraph';
import CustomToggleButton from '../mui-overrides/CustomToggleButton';
import CustomToggleButtonGroup from '../mui-overrides/CustomToggleButtonGroup';
import PortfolioTable from '../PortfolioTable';
import PortfolioDetails from '../PortfolioDetails';
import { Grid, Container, Alert, Typography } from '@mui/material';
import CenteredProgress from '../CenteredProgress';
import MissingData from '../MissingData';
import './Portfolio.css';

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
        {balances.length > 0 ? (
          <PortfolioLineGraph
            labels={labels}
            balances={balances}
            startingWeek={startingWeek}
          />
        ) : null}
      </Grid>

      <Grid container item xs={12}>
        <Grid item xs={6}>
          {dividends.length > 0 ? (
            <DividendBarGraph labels={labels} dividends={dividends} />
          ) : null}
        </Grid>

        <Grid item xs={6}>
          {Object.keys(holdings).length > 0 ? (
            <HoldingsBarGraph holdings={holdings} />
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
