import {
  getMultipleTimeSeriesDailyAdjusted,
  getMultipleTimeSeriesWeeklyAdjusted,
  getTimeSeriesMonthlyAdjusted,
} from './alphavantageService';
import PortfolioHoldings from './PortfolioHoldings';
import { getDateRange } from './dateService';
import subMonths from 'date-fns/subMonths';
import format from 'date-fns/format';
import parse from 'date-fns/parse';

// mock data
import myData from '../mock/mydata.json';

// construct a dictionary (date) -> [events]
const parseBrokerData = () => {
  const uniqueSymbols = new Set();
  const transactionsByDate = {};
  myData.forEach((d) => {
    const transactionDate = d['TransactionDate'];
    if (transactionDate in transactionsByDate) {
      transactionsByDate[transactionDate].push(d);
    } else {
      transactionsByDate[transactionDate] = [d];
    }

    uniqueSymbols.add(d['Symbol']);
  });

  return {
    uniqueSymbols,
    transactionsByDate,
  };
};

const updatePortfolioWithTransactions = (transactions, portfolioHoldings) => {
  transactions.forEach((t) => {
    // check if symbol already exists in our portfolio
    const symbol = t['Symbol'];
    const action = t['Action'];
    if (symbol in portfolioHoldings.holdings) {
      const found = portfolioHoldings.holdings[symbol];
      if (action === 'Buy') {
        // previous total cost
        const previousCost = found['quantity'] * found['averagePrice'];

        // update quantity
        found['quantity'] += t['Quantity'];

        // calculate new average price: total cost / total quantity
        const averagePrice = (previousCost + t['Gross']) / found['quantity'];
        found['averagePrice'] = averagePrice;
      } else {
        found['quantity'] -= t['Quantity'];
        // (sell price - buy price) * qty
        portfolioHoldings.realizedGains +=
          (t['Price'] - found['averagePrice']) * t['Quantity'];
      }
    } else {
      // might need to account for short positions later
      portfolioHoldings.holdings[symbol] = {
        quantity: t['Quantity'],
        averagePrice: t['Price'],
      };
    }
  });
};

export const getDailyBalances = async () => {
  const dateRange = getDateRange(subMonths(new Date(), 3), new Date());
  const formattedDates = dateRange.map((date) => format(date, 'yyyy-MM-dd'));

  const { uniqueSymbols, transactionsByDate } = parseBrokerData();

  const timeSeriesBySymbol = await getMultipleTimeSeriesDailyAdjusted([
    ...uniqueSymbols,
  ]);

  const labels = [];
  const balances = [];
  const dividends = [];
  const portfolioHoldings = new PortfolioHoldings();
  const holdings = portfolioHoldings.holdings;

  // need to account for dates outside of the range
  const sortedTransactionDates = Object.keys(transactionsByDate).sort();
  const earlierDates = sortedTransactionDates.filter(
    (date) => date < formattedDates[0]
  );
  earlierDates.forEach((date) => {
    updatePortfolioWithTransactions(
      transactionsByDate[date],
      portfolioHoldings
    );
  });

  formattedDates.forEach((date) => {
    // for now lets just skip dates without any ticker changes
    if (!(date in timeSeriesBySymbol[Object.keys(timeSeriesBySymbol)[0]])) {
      return;
    }

    // check if that date has any transactions
    if (date in transactionsByDate) {
      updatePortfolioWithTransactions(
        transactionsByDate[date],
        portfolioHoldings
      );
    }

    let dailyBalance = 0;
    let dailyDividends = 0;
    // check out entire portfolio and calculate for every symbol
    // check if that date has any price changes and adjust with closing prices
    for (const [symbol, detail] of Object.entries(holdings)) {
      const tickerData = timeSeriesBySymbol[symbol][date];
      const closing = tickerData['4. close'];
      const dividendRate = tickerData['7. dividend amount'];

      if (dividendRate > 0) {
        const dividend = dividendRate * detail['quantity'];
        portfolioHoldings.realizedGains += dividend;
        dailyDividends += dividend;
      }

      dailyBalance += detail['quantity'] * closing;

      // TODO account for stock splits
      // stock splits change quantity & price
    }

    // push total after everyday
    labels.push(date);
    balances.push(dailyBalance);
    dividends.push(dailyDividends);
  });

  // calculate total invested at the end
  let totalInvested = 0;
  for (const [symbol, info] of Object.entries(holdings)) {
    totalInvested += info['averagePrice'] * info['quantity'];

    // store market value as well
    const lastDate = Object.keys(timeSeriesBySymbol[symbol])[0];
    holdings[symbol]['marketPrice'] = parseFloat(
      timeSeriesBySymbol[symbol][lastDate]['4. close']
    );
  }

  return {
    holdings: holdings,
    totalInvested: totalInvested,
    realizedGains: portfolioHoldings.realizedGains,
    labels: labels,
    balances: balances,
    dividends: dividends,
  };
};

export const getMonthlyBalances = async () => {
  const { uniqueSymbols, transactionsByDate } = parseBrokerData();

  const monthlyTimeSeries = await getTimeSeriesMonthlyAdjusted([
    ...uniqueSymbols,
  ]);

  // just get 12 months worth
  const closest12Dates = Object.keys(monthlyTimeSeries).slice(0, 12);

  closest12Dates.forEach((date) => {
    const dateObject = parse(date, 'yyyy-MM-dd', new Date());
    console.log(dateObject.getFullYear(), dateObject.getMonth());

    // do a cum sum for the month for the transactions,
    // cum sum the quantity, need to calculate realized gains along the way too
  });

  // need to parse broker data into months, see if match
};

export const getWeeklyBalances = async () => {
  const { uniqueSymbols, transactionsByDate } = parseBrokerData();

  const { tradeWeekDates, timeSeriesBySymbol } =
    await getMultipleTimeSeriesWeeklyAdjusted([...uniqueSymbols]);

  const sortedTransactionDates = Object.keys(transactionsByDate).sort();

  // create new dictionary transactionsByWeek
  const transactionsByWeek = sortedTransactionDates.reduce((dict, date) => {
    // skip any transactions that occured before the first trade week dates
    let lastTradingDayOfTradeWeek = date;
    if (date > tradeWeekDates[0]) {
      lastTradingDayOfTradeWeek = getLastTradingDayOfTradeWeek(
        date,
        tradeWeekDates
      );
    }
    const transactions = transactionsByDate[date];
    dict[lastTradingDayOfTradeWeek] = transactions;

    return dict;
  }, {});

  const labels = [];
  const balances = [];
  const dividends = [];
  const portfolioHoldings = new PortfolioHoldings();
  const holdings = portfolioHoldings.holdings;

  const sortedTransactionWeeks = Object.keys(transactionsByWeek).sort();
  const earlierDates = sortedTransactionWeeks.filter(
    (date) => date < tradeWeekDates[0]
  );
  earlierDates.forEach((date) => {
    updatePortfolioWithTransactions(
      transactionsByWeek[date],
      portfolioHoldings
    );
  });

  tradeWeekDates.forEach((date) => {
    if (date in transactionsByWeek) {
      updatePortfolioWithTransactions(
        transactionsByWeek[date],
        portfolioHoldings
      );
    }

    let weeklyBalance = 0;
    let weeklyDividends = 0;

    for (const [symbol, detail] of Object.entries(holdings)) {
      const tickerData = timeSeriesBySymbol[symbol][date];
      const closing = tickerData['4. close'];
      const dividendRate = tickerData['7. dividend amount'];

      if (dividendRate > 0) {
        const dividend = dividendRate * detail['quantity'];
        portfolioHoldings.realizedGains += dividend;
        weeklyDividends += dividend;
      }

      weeklyBalance += detail['quantity'] * closing;

      // TODO account for stock splits
      // stock splits change quantity & price
    }

    labels.push(date);
    balances.push(weeklyBalance);
    dividends.push(weeklyDividends);
  });

  // calculate total invested
  let totalInvested = 0;
  for (const [symbol, info] of Object.entries(holdings)) {
    totalInvested += info['averagePrice'] * info['quantity'];

    // store market value as well
    const lastDate = Object.keys(timeSeriesBySymbol[symbol])[0];
    holdings[symbol]['marketPrice'] = parseFloat(
      timeSeriesBySymbol[symbol][lastDate]['4. close']
    );
  }

  return {
    holdings,
    totalInvested,
    realizedGains: portfolioHoldings.realizedGains,
    labels,
    balances,
    dividends,
  };
};

/**
 * Finds and returns the last trading day for the week a trade was made on
 * from a sorted list of dates which are the last trading day of each week
 * @param {string} tradeDate - Trade date in yyyy-MM-dd format (eg. 2021-12-31)
 * @param {string[]} dates - Sorted list of dates in yyyy-MM-dd format
 * @returns {string} Date found from list of dates
 */
const getLastTradingDayOfTradeWeek = (tradeDate, dates) => {
  let low = 0;
  let high = dates.length - 1;
  let mid = 0;

  while (low <= high) {
    mid = Math.floor((low + high) / 2);

    if (tradeDate === dates[mid]) {
      // return mid
      return dates[mid];
    } else if (tradeDate > dates[mid]) {
      low = mid + 1;
    } else if (tradeDate < dates[mid]) {
      high = mid - 1;
    }
  }

  // we want next highest without going over
  return dates[low];
};
