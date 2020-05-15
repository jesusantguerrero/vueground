<template>
  <div class="card item-card">
    <h1 class="numbers">
      {{ number }}
    </h1>
    <p class="text-white">{{ label }}</p>
  </div>
</template>

<script>
export default {
  props: {
    number: Number,
    label: String
  }
};
</script>