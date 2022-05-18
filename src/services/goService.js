// local api key
import config from '../config.json';

export const getDailyPricesGoApi = async (symbol) => {
  // AAPL
  const response = await window.getDailyPricesGoApi(config.apiKey, symbol);
  const message = await response.json();

  console.log(message);
};

export const parseBrokerData = async (stringData, broker) => {
  const result = await window.parseDocument(stringData, broker);
  const data = await result.json();

  // need to re parse data Symbols and Transactions
  const uniqueSymbols = new Set(Object.keys(data.Symbols));
  const transactionsByDate = data.Transactions;

  return { uniqueSymbols, transactionsByDate };
};
