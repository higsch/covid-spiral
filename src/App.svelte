<script>
  import { countryData } from './stores/data';

  import CountrySelector from './components/CountrySelector.svelte';
  import Chart from './components/Chart.svelte';
</script>

<div class="wrapper">
  <div class="selector-wrapper">
    <CountrySelector />
  </div>
  <div class="spiral-wrapper">
    <Chart
      data={$countryData}
    />
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  .spiral-wrapper {
    flex: 1;
    overflow: hidden;
  }
</style>