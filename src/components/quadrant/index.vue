<template>
  <div>
    <layout
      :user="quadrantApp && quadrantApp.state.context.user"
      :app-machine="quadrantApp"
    ></layout>
    <div class="container-fluid text-primary">
      <div
        v-if="matches('loading')"
        class="d-flex justify-content-center align-item-center text-primary"
      >
        <i class="fa fa-spinner fa-spin bigger"></i>
      </div>
      <div class="text-primary container-fluid">
        <div id="auth-container" v-if="matches('unauthenticated')"></div>
        {{ quadrantApp && quadrantApp.state.value }}
      </div>
    </div>
  </div>
</template>

<script>
import { interpret } from "xstate";
import appMachine from "./appMachine";
import Layout from "@/components/quadrant/layout";

export default {
  components: {
    Layout
  },
  data() {
    return {
      quadrantApp: null
    };
  },
  mounted() {
    this.initMachine();
  },
  methods: {
    initMachine() {
      this.quadrantApp = appMachine;
      this.quadrantApp.start();
      this.quadrantApp.send("FETCH_TOKEN");
    },
    matches(stateName) {
      return this.quadrantApp && this.quadrantApp.state.matches(stateName);
    },
    send(stateName, payload) {
      return (
        this.quadrantApp &&
        this.quadrantApp.send({ type: stateName, payload: payload })
      );
    }
  }
};
</script>

<style lang="scss">
$foreColor: #444444;

html,
body {
  background: white !important;
  color: foreColor !important;
}
</style>
