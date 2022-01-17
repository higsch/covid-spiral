<script>
  import Chart from './Chart.svelte';

  export let data;
  export let title;
  export let maxWidth;
  export let maxCases = null;
</script>

<div
  class="cell"
  style="max-width: {maxWidth}px;
         height: {maxWidth}px;"
>
  <h2>
    {title}
  </h2>
  <div class="chart-wrapper">
    <Chart
      data={data}
      maxCases={maxCases}
    />
  </div>
</div>

<style>
  .cell {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  h2 {
    font-family: Arial;
    font-size: 1rem;
    text-align: center;
  }

  .chart-wrapper {
    flex: 1;
  }
</style>