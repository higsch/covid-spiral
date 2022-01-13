import { readable, derived } from 'svelte/store';
import { csv, autoType, sum } from 'd3';

import { getDayOfYear, getYearDays } from '../utils/datetime';

const dataPath = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv';
const selectedIso = 'DEU';

export const data = readable([], async set => {
  const data = await csv(dataPath, autoType);
  set(data);
});

export const countryData = derived(data, $data => {
  const filteredData =  $data.filter(d => d.iso_code === selectedIso);
  const formattedData = filteredData.map((d, i, arr) => {
    const dayOfYear = getDayOfYear(d.date);
    const incidence = 100000 * sum(arr.slice(Math.max(0, i - 7), i + 1).map(dd => dd.new_cases)) / d.population;
    return {
      date: d.date,
      dayOfYear,
      cumDay: getYearDays(dayOfYear, d.date.getFullYear(), arr[0].date.getFullYear()),
      incidence
    };
  });

  return formattedData;
});