import { createContext, useState, useContext } from 'react';

import { getDailyBalances } from '../services/portfolioService';

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
    const {
      holdings,
      totalInvested,
      realizedGains,
      labels,
      balances,
      dividends,
    } = await getDailyBalances();
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
