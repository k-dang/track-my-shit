import {
  getMultipleTimeSeriesDailyAdjusted,
  getTimeSeriesMonthlyAdjusted,
} from './alphavantageService';
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
  const holdings = {};
  let realizedGains = 0;

  formattedDates.forEach((date) => {
    // for now lets just skip dates without any ticker changes
    if (!(date in timeSeriesBySymbol[Object.keys(timeSeriesBySymbol)[0]])) {
      return;
    }

    // check if that date has any transactions
    if (date in transactionsByDate) {
      const transactions = transactionsByDate[date];
      transactions.forEach((t) => {
        // check if symbol already exists in our portfolio
        const symbol = t['Symbol'];
        const action = t['Action'];
        if (symbol in holdings) {
          const found = holdings[symbol];
          if (action === 'Buy') {
            // previous total cost
            const previousCost = found['quantity'] * found['averagePrice'];

            // update quantity
            found['quantity'] += t['Quantity'];

            // calculate new average price: total cost / total quantity
            const averagePrice =
              (previousCost + t['Gross']) / found['quantity'];
            found['averagePrice'] = averagePrice;
          } else {
            found['quantity'] -= t['Quantity'];
            // (sell price - buy price) * qty
            realizedGains +=
              (t['Price'] - found['averagePrice']) * t['Quantity'];
          }
        } else {
          // might need to account for short positions later
          holdings[symbol] = {
            quantity: t['Quantity'],
            averagePrice: t['Price'],
          };
        }
      });
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
        realizedGains += dividend;
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
    realizedGains: realizedGains,
    labels: labels,
    balances: balances,
    dividends: dividends,
  };
};

export const getMonthlyBalances = async () => {
  const { uniqueSymbols, transactionsByDate } = parseBrokerData();

  const monthlyTimeSeries = await getTimeSeriesMonthlyAdjusted('IBM');

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
