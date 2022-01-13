<script>
  import {
    scaleLinear,
    min,
    max,
    line,
    curveBasis as curve } from 'd3';

  import { getPositionFromDistanceAndAngle, fusePaths } from '../utils/geometry';

  export let data = [];

  const padding = 50;
  const baseSpiralGenerator = line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(curve);

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

  $: radiusScale = scaleLinear()
    .domain([0, max(data, d => d.cumDay)])
    .range([minDim / 100, minDim / 2 - padding]);

  $: radiusOffsetScale = scaleLinear()
    .domain([0, max(data, d => d.incidence)])
    .range([0, minDim / 20]);

  $: angleScale = scaleLinear()
    .domain([0, max(data, d => d.dayOfYear)])
    .range([-90, 270]);

  $: renderedData = data.map(d => {
    const radius = radiusScale(d.cumDay);
    const radiusOffset = radiusOffsetScale(d.incidence);
    const angle = angleScale(d.dayOfYear);
    const { x, y } = getPositionFromDistanceAndAngle(radius, angle);
    const { x: x_offset_1, y: y_offset_1 } = getPositionFromDistanceAndAngle(radius + radiusOffset, angle);
    const { x: x_offset_2, y: y_offset_2 } = getPositionFromDistanceAndAngle(radius - radiusOffset, angle);
    return {
      ...d,
      angle,
      x,
      y,
      x_offset_1,
      y_offset_1,
      x_offset_2,
      y_offset_2
    };
  });

  $: combinedPath = fusePaths(
    offsetSpiral1Generator(renderedData) || 'M0 0',
    offsetSpiral2Generator([...renderedData].reverse()) || 'M0 0'
  );
</script>

<div
  class="spiral"
  bind:clientWidth={width}
  bind:clientHeight={height}
>
  <svg
    width={width}
    height={height}
  >
    <g
      transform="translate({width / 2} {height / 2})"
    >
      <path
        class="offset-spiral"
        d={combinedPath}
      />
    </g>
  </svg>
</div>

<style>
  .spiral {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  path {
    stroke: none;
    fill: pink;
  }
</style>