<script>
  import { countryData } from './stores/data';

  import Spiral from './components/Spiral.svelte';
</script>

<div class="wrapper">
  <div class="spiral-wrapper">
    <Spiral
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
</style>