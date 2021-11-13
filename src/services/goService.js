// local api key
import config from '../config.json';

export const getDailyPricesGoApi = async (symbol) => {
  // AAPL
  const response = await window.getDailyPricesGoApi(config.apiKey, symbol);
  const message = await response.json();

  console.log(message);
};
