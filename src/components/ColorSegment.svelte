<script>
  import { getContext, onMount, onDestroy, afterUpdate } from 'svelte';

  export let path;
  export let color;

  const { register, deregister, invalidate } = getContext('canvas');

  function draw(ctx) {
    if (!path) return;

    const p = new Path2D(path);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.fill(p);
    ctx.stroke(p);
  }

  onMount(() => {
    invalidate();
    register(draw);
    return () => {
      deregister(draw);
    };
  });

	afterUpdate(invalidate);
	onDestroy(invalidate);
</script>