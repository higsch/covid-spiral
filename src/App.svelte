<script>
  import { continentData, wealthStatusData, countryData } from './stores/data';

  import Grid from './components/Grid.svelte';
  import Cell from './components/Cell.svelte';

  let maxCases = null;
</script>

<div
  class="wrapper"
>
  <section
    class="continents"
  >
    <Grid let:maxCellWidth>
      {#each $continentData as { location, data }}
        <Cell
          data={data}
          title={location}
          maxWidth={maxCellWidth}
          maxCases={maxCases}
        />
      {/each}
    </Grid>
  </section>
  <section
    class="wealth-status"
  >
    <Grid let:maxCellWidth>
      {#each $wealthStatusData as { location, data }}
        <Cell
          data={data}
          title={location}
          maxWidth={maxCellWidth}
          maxCases={maxCases}
        />
      {/each}
    </Grid>
  </section>
  <section
    class="countries"
  >
    <Grid let:maxCellWidth>
      {#each $countryData as { location, data }}
        <Cell
          data={data}
          title={location}
          maxWidth={maxCellWidth}
          maxCases={maxCases}
        />
      {/each}
    </Grid>
  </section>
</div>

<style>
  .wrapper {
    width: 100%;
    padding-top: 1.2rem;
  }
</style>