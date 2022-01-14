<script>
  import { locations, selectedLocation } from '../stores/data';
</script>

<div class="country-selector">
  <select bind:value={$selectedLocation}>
    {#each $locations as location}
      <option value={location}>{location}</option>
    {/each}
  </select>
</div>

<style>
  .country-selector {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  select {
    width: 60%;
    min-width: 250px;
    max-width: 400px;
    font-size: 1.25rem;
  }
</style>