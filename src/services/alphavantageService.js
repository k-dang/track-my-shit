import alphavantage from '../api/alphavantage';

// local api key
import config from '../config.json';

export const getTimeSeriesDailyAdjusted = async (symbol) => {
  // by default returns only 100 data points
  const response = await alphavantage.get(
    `/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${config.apiKey}`
  );

  const result = response.data['Time Series (Daily)'];
  return result;
};

export const getMultipleTimeSeriesDailyAdjusted = async (symbols) => {
  const promises = [];
  for (const symbol of symbols) {
    promises.push(getTimeSeriesDailyAdjusted(symbol));
  }

  const allTimeSeries = await Promise.all(promises);

  const timeSeriesBySymbol = {};
  for (const [index, timeSeries] of allTimeSeries.entries()) {
    timeSeriesBySymbol[symbols[index]] = timeSeries;
  }

  return timeSeriesBySymbol;
};

export const getTimeSeriesWeeklyAdjusted = async (symbol) => {
  const response = await alphavantage.get(
    `/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${symbol}&apikey=${config.apiKey}`
  );

  const result = response.data['Weekly Adjusted Time Series'];
  return result;
};

export const getTimeSeriesMonthlyAdjusted = async (symbol) => {
  const response = await alphavantage.get(
    `/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${symbol}&apikey=${config.apiKey}`
  );

  const result = response.data['Monthly Adjusted Time Series'];
  return result;
};