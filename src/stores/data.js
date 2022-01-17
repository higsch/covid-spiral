import { readable, writable, derived } from 'svelte/store';
import { csv, autoType, sum, groups } from 'd3';

import { getDayOfYear, getYearDays } from '../utils/datetime';

const dataPath = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv';
const exclude = [
  'International'
];
const continents = [
  'North America',
  'South America',
  'Europe',
  'Africa',
  'Oceania',
  'Asia',
  'World'
];
const wealthStatus = [
  'High income',
  'Upper middle income',
  'Lower middle income',
  'Low income'
];

const getSevenDayIncidence = (data, i, population) => {
  return 100000 * sum(data.slice(Math.max(0, i - 7), i + 1)) / population;
};

export const selectedLocation = writable('Germany');

export const rawData = readable([], async set => {
  const data = await csv(dataPath, autoType);
  set(data);
});

export const locations = derived(rawData, $rawData => {
  return [...new Set($rawData.map(d => d.location))].sort();
});

export const data = derived(rawData, $rawData => {
  const formattedData = $rawData.map((d, _, arr) => {
    const dayOfYear = getDayOfYear(d.date);
    const incidence = +d.new_cases_smoothed_per_million;
    const deaths = +d.new_deaths_smoothed_per_million * 10;
    const icu = +d.icu_patients_per_million;
    const { date, location } = d;
    return {
      location,
      date,
      dayOfYear,
      cumDay: getYearDays(dayOfYear, date.getFullYear(), arr[0].date.getFullYear()),
      incidence,
      deaths,
      icu
    };
  }).filter(d => !exclude.includes(d.location));

  return formattedData;
});

export const objData = derived(data, $data => {
  const objData = groups($data, d => d.location).map(([ key, value ]) => {
    return {
      location: key,
      data: value
    };
  });

  return objData;
});

export const continentData = derived(objData, $objData => {
  return $objData.filter(d => continents.includes(d.location));
});

export const countryData = derived(objData, $objData => {
  return $objData.filter(d => !continents.includes(d.location));
});

export const wealthStatusData = derived(objData, $objData => {
  return $objData.filter(d => wealthStatus.includes(d.location));
});