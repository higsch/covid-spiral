<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { interpolatePath as interpolate } from 'd3-interpolate-path';

  export let path;
  export let fillColor = '#000000';
  export let maskId = null;

  const tPath = tweened(null, {
    duration: 400,
    easing: cubicOut,
    interpolate
  });

  $: tPath.set(path);
</script>

{#if (maskId)}
  <mask id={maskId}>
    <path
      class="tweened-path"
      d={$tPath}
      stroke="none"
      fill="#FFFFFF"
    />
  </mask>
{:else}
  <path
    class="tweened-path"
    d={$tPath}
    stroke="none"
    fill={fillColor}
  />
{/if}