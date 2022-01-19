import { createContext, useState, useContext } from 'react';

import { getWeeklyBalances } from '../services/portfolioService';

const StockContext = createContext();

export const useStock = () => {
  return useContext(StockContext);
};

export const StockProvider = ({ children }) => {
  const [stockData, setStockData] = useState({
    holdings: [],
    totalInvested: 0,
    realizedGains: 0,
    labels: [],
    balances: [],
    dividends: [],
  });
  const [status, setStatus] = useState('idle');

  const getStockPortfolio = async () => {
    setStatus('pending');

    if (process.env.NODE_ENV === 'development') {
      console.log('using dev data');
    }
    const {
      holdings,
      totalInvested,
      realizedGains,
      labels,
      balances,
      dividends,
    } = await getWeeklyBalances();
    setStatus('resolved');

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
  };

  const value = { stockData, status, getStockPortfolio };

  return (
    <StockContext.Provider value={value}>{children}</StockContext.Provider>
  );
};
