<script>
  import { onDestroy, setContext } from 'svelte';

  export let width = 0;
  export let height = 0;
  export let maskPath = null;
  export let pixelRatio = window.devicePixelRatio || 1;

  const drawFunctions = [];

  const setupCanvas = (canvas, width = 0, height = 0) => {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(pixelRatio, pixelRatio);
    ctx.translate(width / 2, height / 2);

    return ctx;
  };

  let canvas;
  let ctx;
  let frameId;
  let pendingInvalidation = false;

  setContext('canvas', {
    register(fn) {
      drawFunctions.push(fn);
    },
    deregister(fn) {
      drawFunctions.splice(drawFunctions.indexOf(fn), 1);
    },
    invalidate() {
			if (pendingInvalidation) return;
			pendingInvalidation = true;
			frameId = requestAnimationFrame(update);
		}
  });

  function update() {
    if (!ctx) return;

    ctx.clearRect(-width / 2, -height / 2, width, height);

    if (maskPath) {
      ctx.save();
      ctx.clip(new Path2D(maskPath));
    }

    drawFunctions.forEach((fn) => {
      ctx.save();
      fn(ctx);
      ctx.restore();
    });

    if (maskPath) {
      ctx.restore();
    }

    pendingInvalidation = false;
  }

  onDestroy(() => {
    if (frameId) {
      cancelAnimationFrame(frameId);
    }
  });

  $: ctx = setupCanvas(canvas, width, height);
</script>

<canvas
  bind:this={canvas}
/>
<slot />

<style>
  canvas {
    position: absolute;
    z-index: 10;
  }
</style>