import differenceInDays from 'date-fns/differenceInDays'
import addDays from 'date-fns/addDays'

export const getDateRange = (startDate, endDate) => {
  const days = differenceInDays(endDate, startDate);

  return [...Array(days+1).keys()].map((i) => addDays(startDate, i));
}