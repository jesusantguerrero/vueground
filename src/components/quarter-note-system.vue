<template>
  <div class="hello container">
    <h1>{{ msg }}</h1>

    <div v-if="quarter" class="row">
      <div
        v-for="quarterState in Object.keys(states)"
        :key="quarterState"
        class="col-md-6"
        :class="{ selected: quarter.state.value.includes(quarterState) }"
      >
        <div class="card w-100 mb-5">
          <div class="card-body">
            <h5 class="card-title">{{ quarterState }}</h5>
            <p class="card-text"></p>
          </div>
        </div>
      </div>
    </div>
    <button class="btn btn-primary" @click="toggleState">Toggle State</button>
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
        console.log(quarterService);
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
