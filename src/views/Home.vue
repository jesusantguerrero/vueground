<template>
  <div class="home">
    <h1 class="text-center">Estado de Republica Dominicana</h1>
    <covid-main></covid-main>
  </div>
</template>

<script>
import CovidMain from "@/components/covid";

export default {
  name: "home",
  components: {
    CovidMain
  }
};
</script>
