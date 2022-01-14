<script>
  import { getPositionFromDistanceAndAngle, getClosedPath } from '../utils/geometry';

  import Canvas from './Canvas.svelte';
  import ColorSegment from './ColorSegment.svelte';

  export let data;
  export let maskPath;
  export let width = 0;
  export let height = 0;

  const radiusOffsetFactor = 1.1;

  $: renderedData = data.map((d, i, arr) => {
    const { radius, angle, radiusOffset, color, x, y } = d;
    const previousRadius = arr[i - 1] ? arr[i - 1].radius : radius;
    const nextRadius = arr[i + 1] ? arr[i + 1].radius : radius;
    const startRadius = (previousRadius + radius) / 2;
    const endRadius = (nextRadius + radius) / 2;

    let previousAngle = arr[i - 1] ? arr[i - 1].angle : angle;
    let nextAngle = arr[i + 1] ? arr[i + 1].angle : angle;

    if (nextAngle < previousAngle) {
      if (angle < 0) {
        previousAngle -= 360;
      } else {
        nextAngle += 360;
      }
    }
    const startAngle = (previousAngle + angle) / 2;
    const endAngle = (nextAngle + angle) / 2;
    
    const { x: x1, y: y1 } = getPositionFromDistanceAndAngle(startRadius - radiusOffset * radiusOffsetFactor, startAngle);
    const { x: x2, y: y2 } = getPositionFromDistanceAndAngle(startRadius + radiusOffset * radiusOffsetFactor, startAngle);
    const { x: x3, y: y3 } = getPositionFromDistanceAndAngle(endRadius + radiusOffset * radiusOffsetFactor, endAngle);
    const { x: x4, y: y4 } = getPositionFromDistanceAndAngle(endRadius - radiusOffset * radiusOffsetFactor, endAngle);

    const previousColor = arr[i - 1] ? arr[i - 1].color : color;
    const nextColor = arr[i + 1] ? arr[i + 1].color : color;

    return {
      angle,
      startAngle,
      endAngle,
      x1, y1,
      x2, y2,
      x3, y3,
      x4, y4,
      x, y,
      color,
      previousColor,
      nextColor
    };
  });
</script>

<Canvas
  width={width}
  height={height}
  maskPath={maskPath}
>
  {#each renderedData as d}
    <ColorSegment
      path={getClosedPath(d)}
      color={d.color}
    />
  {/each}
</Canvas>