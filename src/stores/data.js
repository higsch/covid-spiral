import { readable, writable, derived } from 'svelte/store';
import { csv, autoType, sum } from 'd3';

import { getDayOfYear, getYearDays } from '../utils/datetime';

const dataPath = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv';

const getSevenDayIncidence = (data, i, population) => {
  return 100000 * sum(data.slice(Math.max(0, i - 7), i + 1)) / population;
};

export const selectedLocation = writable('Germany');

export const data = readable([], async set => {
  const data = await csv(dataPath, autoType);
  set(data);
});

export const locations = derived(data, $data => {
  return [...new Set($data.map(d => d.location))].sort();
})

export const countryData = derived([data, selectedLocation], ([$data, $selectedLocation]) => {
  const filteredData =  $data.filter(d => d.location === $selectedLocation);
  const formattedData = filteredData.map((d, _, arr) => {
    const dayOfYear = getDayOfYear(d.date);
    const incidence = +d.new_cases_smoothed_per_million;
    const deaths = +d.new_deaths_smoothed_per_million * 10;
    const icu = +d.icu_patients_per_million;
    return {
      date: d.date,
      dayOfYear,
      cumDay: getYearDays(dayOfYear, d.date.getFullYear(), arr[0].date.getFullYear()),
      incidence,
      deaths,
      icu
    };
  });

  return formattedData;
});