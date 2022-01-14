<script>
  import {
    scaleLinear,
    extent,
    min,
    max,
    line,
    curveBasis as curve,
    interpolateHclLong } from 'd3';

  import { getPositionFromDistanceAndAngle, fusePaths } from '../utils/geometry';

  import TweenedPath from './TweenedPath.svelte';
  import GradientPath from './GradientPath.svelte';

  export let data = [];

  const padding = 50;

  const offsetSpiral1Generator = line()
    .x(d => d.x_offset_1)
    .y(d => d.y_offset_1)
    .curve(curve);

  const offsetSpiral2Generator = line()
    .x(d => d.x_offset_2)
    .y(d => d.y_offset_2)
    .curve(curve);

  let width = 0;
  let height = 0;

  $: minDim = min([width, height]);
  $: maxCases = max(data, d => d.incidence);

  $: radiusScale = scaleLinear()
    .domain([0, max(data, d => d.cumDay)])
    .range([minDim / 100, minDim / 2 - padding]);

  $: radiusOffsetScaleCases = scaleLinear()
    .domain([0, maxCases])
    .range([0, minDim / 10]);

  $: radiusOffsetScaleDeaths = scaleLinear()
    .domain([0, maxCases])
    .range([0, minDim / 10]);

  $: angleScale = scaleLinear()
    .domain([0, max(data, d => d.dayOfYear) + 1])
    .range([1 / 360, 360]);

  $: colorScale = scaleLinear()
    .domain([0, maxCases / 5, maxCases * 2 / 5, maxCases * 3 / 5, maxCases * 4 / 5, maxCases])
    .range(['#EBE8E3', '#f2df91', '#ffa83e', '#fd6a0b', '#d8382e', '#AF1C43'])
    .interpolate(interpolateHclLong);

  $: getRenderedData = (data, accessorRadius, accessorOffset, accessorAngle, radiusOffsetScale) => {
    return data.map(d => {
      const radius = radiusScale(d[accessorRadius]);
      const radiusOffset = radiusOffsetScale(d[accessorOffset]);
      const angle = angleScale(d[accessorAngle]) - 90;
      const { x, y } = getPositionFromDistanceAndAngle(radius, angle);
      const { x: x_offset_1, y: y_offset_1 } = getPositionFromDistanceAndAngle(radius + radiusOffset, angle);
      const { x: x_offset_2, y: y_offset_2 } = getPositionFromDistanceAndAngle(radius - radiusOffset, angle);
      return {
        ...d,
        radius,
        radiusOffset,
        angle,
        x,
        y,
        x_offset_1,
        y_offset_1,
        x_offset_2,
        y_offset_2,
        color: colorScale(d[accessorOffset]),
        incidence: d[accessorOffset]
      };
    });
  }

  $: renderedDataCases = getRenderedData(data, 'cumDay', 'incidence', 'dayOfYear', radiusOffsetScaleCases);

  $: combinedPathCases = fusePaths(
    offsetSpiral1Generator(renderedDataCases) || 'M0 0',
    offsetSpiral2Generator([...renderedDataCases].reverse()) || 'M0 0'
  );

  $: renderedDataDeaths = getRenderedData(data, 'cumDay', 'deaths', 'dayOfYear', radiusOffsetScaleDeaths);

  $: combinedPathDeaths = fusePaths(
    offsetSpiral1Generator(renderedDataDeaths) || 'M0 0',
    offsetSpiral2Generator([...renderedDataDeaths].reverse()) || 'M0 0'
  );
</script>

<div
  class="spiral"
  bind:clientWidth={width}
  bind:clientHeight={height}
>
  <GradientPath
    data={renderedDataCases}
    maskPath={combinedPathCases}
    width={width}
    height={height}
  />
  <svg
    width={width}
    height={height}
  >
    <g
      transform="translate({width / 2} {height / 2})"
    >
      <TweenedPath
        path={combinedPathDeaths}
        fillColor="black"
      />
    </g>
  </svg>
</div>

<style>
  .spiral {
    width: 100%;
    height: 100%;
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
  }
</style>