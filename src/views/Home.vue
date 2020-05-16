<template>
  <div class="home">
    <h1 class="text-center">Estado de Republica Dominicana</h1>
    <QuarterApi></QuarterApi>
  </div>
</template>

<script>
import QuarterApi from "@/components/quarter-api.vue";

export default {
  name: "home",
  components: {
    QuarterApi
  }
};
</script>
