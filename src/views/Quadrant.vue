<template>
  <layout></layout>
</template>

<script>
import Layout from "@/components/quadrant/index.vue";

export default {
  components: {
    Layout
  }
};
</script>

<style lang="scss">
$foreColor: #444444;

html,
body {
  background: white !important;
  color: foreColor;
}

.selected {
  color: dodgerblue;
}
</style>
