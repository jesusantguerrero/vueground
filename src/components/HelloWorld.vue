<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  
    <div v-if="quarter">
      <div v-for="quarterState in Object.keys(states)" :key="quarterState" :class="{selected: quarterState == state}">
        {{ quarterState }}
      </div>
    </div>
    <button @click="toggleState">Toggle State</button>
  </div>
</template>

<script>
import { createMachine, interpret } from "xstate";

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      quarter: null,
      state: null,
      states: {
        do: {
          on: { TOGGLE: "delegate" }
        },
        delegate: {
          on: { TOGGLE: "schedule" }
        },
        schedule: {
          on: { TOGGLE: "drop" }
        },
        drop: {
          on: { TOGGLE: "do" }
        }
      }
    };
  },
  mounted() {
    const fourQuarterMachine = createMachine({
      id: "quarter",
      initial: "do",
      states: this.states
    });

    const quarterService = interpret(fourQuarterMachine)
      .onTransition(state => {
        this.state = state.value;
      })
      .start();
    this.quarter = quarterService;
  },
  methods: {
    toggleState() {
      this.quarter.send("TOGGLE");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.selected {
  color: dodgerblue;
}
</style>
