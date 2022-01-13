const monthDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const getDayOfYear = (date) => {
  const month = +date.getMonth();
  const day = +date.getDate();

  const previousMonthDays = monthDays.slice(0, month).reduce((acc, cur) => acc + cur, 0);

  return previousMonthDays + day - 1;
};

export const getYearDays = (day, year, firstYear) => day + (366 * (year - firstYear));