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

/**
 * Gets the weekly trade dates for the past 52 weeks and time series by symbol
 * @param {string[]} symbols - ticker symbols to get time series for
 * @returns {string[]} tradeWeekDates - end dates of trade weeks sorted
 * @returns {Object} timeSeriesBySymbol - time series dict by symbol
 */
export const getMultipleTimeSeriesWeeklyAdjusted = async (symbols) => {
  const promises = [];
  for (const symbol of symbols) {
    promises.push(getTimeSeriesWeeklyAdjusted(symbol));
  }

  const allTimeSeries = await Promise.all(promises);

  const tradeWeekDates = Object.keys(allTimeSeries[0]).slice(0, 52);
  tradeWeekDates.reverse();

  const timeSeriesBySymbol = {};
  for (const [index, timeSeries] of allTimeSeries.entries()) {
    timeSeriesBySymbol[symbols[index]] = timeSeries;
  }

  return {
    tradeWeekDates,
    timeSeriesBySymbol
  }
}

export const getTimeSeriesMonthlyAdjusted = async (symbol) => {
  const response = await alphavantage.get(
    `/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${symbol}&apikey=${config.apiKey}`
  );

  const result = response.data['Monthly Adjusted Time Series'];
  return result;
};