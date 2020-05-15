<template>
  <div class="home">
    <h1 class="text-center">Status of RD</h1>
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <!-- <QuarterNoteSystem msg="Welcome to Your Vue.js App" /> -->
    <QuarterApi></QuarterApi>
  </div>
</template>

<script>
// @ is an alias to /src
import QuarterNoteSystem from "@/components/quarter-note-system.vue";
import QuarterApi from "@/components/quarter-api.vue";

export default {
  name: "home",
  components: {
    QuarterNoteSystem,
    QuarterApi
  }
};
</script>
