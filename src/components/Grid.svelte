<script>
  let width;

  $: maxCellWidth = Math.min(400, width);
</script>

<div
  class="grid"
  bind:clientWidth={width}
>
  <slot maxCellWidth={maxCellWidth} />
</div>

<style>
  .grid {
    display: flex;
    flex-wrap: wrap;
    place-content: center;
    place-items: center;
    width: 100%;
  }
</style>