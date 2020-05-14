<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <QuarterNoteSystem msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import QuarterNoteSystem from "@/components/quarter-note-system.vue";

export default {
  name: "home",
  components: {
    QuarterNoteSystem
  }
};
</script>
