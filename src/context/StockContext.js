import { createContext, useState, useContext, useEffect } from 'react';

import { getWeeklyBalances } from '../services/portfolioService';

const StockContext = createContext();

export const useStock = () => {
  return useContext(StockContext);
};

export const StockProvider = ({ children }) => {
  const [stockData, setStockData] = useState({
    holdings: {},
    totalInvested: 0,
    realizedGains: 0,
    labels: [],
    balances: [],
    dividends: [],
  });
  const [status, setStatus] = useState('idle');
  const [localDataExists, setLocalDataExists] = useState(true);

  const loadStockPortfolioFromStorage = () => {
    setStatus('pending');

    const weeklyBalancesItem = localStorage.getItem('weeklyBalances');
    const weeklyBalances = JSON.parse(weeklyBalancesItem);
    const {
      holdings,
      totalInvested,
      realizedGains,
      labels,
      balances,
      dividends,
    } = weeklyBalances;

    setStockData({
      holdings,
      totalInvested,
      realizedGains,
      labels,
      balances,
      dividends,
    });
    setStatus('resolved');
  };

  const parseStockPortfolio = async () => {
    setStatus('pending');

    if (process.env.NODE_ENV === 'development') {
      console.log('using dev data');
    }

    const weeklyBalances = await getWeeklyBalances();
    const {
      holdings,
      totalInvested,
      realizedGains,
      labels,
      balances,
      dividends,
    } = weeklyBalances;

    // TODO verify data
    // setStatus('rejected');
    setStockData({
      holdings,
      totalInvested,
      realizedGains,
      labels,
      balances,
      dividends,
    });
    setStatus('resolved');

    localStorage.setItem('weeklyBalances', JSON.stringify(weeklyBalances));
    setLocalDataExists(true);
  };

  useEffect(() => {
    if (localStorage.getItem('weeklyBalances') !== null) {
      loadStockPortfolioFromStorage();
    } else {
      setLocalDataExists(false);
    }
  }, []);

  const value = {
    stockData,
    status,
    localDataExists,
    parseStockPortfolio,
  };

  return (
    <StockContext.Provider value={value}>{children}</StockContext.Provider>
  );
};
