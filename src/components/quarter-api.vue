<template>
  <div class="pt-5">
    <div v-if="matches('loading')" class="d-flex justify-content-center align-item-center">
       <i class="fa fa-spinner fa-spin bigger"></i>
    </div>

    <div class="row" v-else>
      <!-- stats -->
      <div class="col-md-3">
        <app-sider :form-data="postService.state.context.posts"></app-sider>
      </div>

      <!-- States info -->
      <div class="col-md-4">
        <side-chart :series="postService.state.context.posts" style="width: 100%; height: 500px"/>
      </div>

      <!-- Country Graph -->
      <div class="col-md-5">  
        <rd
          class="mt-5"
          @selected="selectedProvince = $event"
        ></rd>
        <div>
          <h1 class="text-center"> Provincia</h1>
          <h2 class="text-center">{{ selectedProvince }}</h2>
        </div>
      </div>

      <div class="col-md-4">

      </div>


      <!-- Caller -->
    </div>
  </div>
</template>

<script>
import { createMachine, interpret, assign } from "xstate";
import SideChart from "./side-chart.vue";
import AppSider from "./sider.vue";
import Rd from "./RD.vue";

export default {
  name: "PostsMachine",
  props: {
    msg: String
  },
  components: {
    AppSider,
    SideChart,
    Rd
  },
  data() {
    return {
      postService: null,
      state: null,
      selectedProvince: '',
      historicalEndpoint:
        "https://corona.lmao.ninja/v2/historical/dominican%20republic",
      postApiEndpint:
        "https://corona.lmao.ninja/v2/countries/dominican%20republic?yesterday=true&strict=true"
    };
  },
  created() {
    const postMachine = createMachine({
      id: "goblog",
      initial: "idle",
      context: {
        posts: null,
        series: null
      },
      states: {
        idle: {
          on: { FETCH: "loading" }
        },
        loading: {
          invoke: {
            id: "fetchPosts",
            src: () => this.fetchData(),
            onDone: {
              target: "loaded",
              actions: assign({
                posts: (context, event) => event.data
              })
            },
            onError: "fail"
          },
          on: { CANCEL: "idle" }
        },
        loaded: {
          on: { FETCH: "loading" }
        },
        fail: {
          on: { FETCH: "loading" }
        }
      }
    });

    const postService = interpret(postMachine)
      .onTransition(state => {
        this.state = state.value;
        console.log(this.postService);
      })
      .start();
    this.postService = postService;
    this.send('FETCH');
  },
  methods: {
    matches(stateName) {
      return this.postService.state.matches(stateName);
    },

    send(actionName) {
      this.postService.send("FETCH");
    },

    async fetchData() {
        const data = await fetch(this.postApiEndpint).then(data => data.json());
        const series = await fetch(this.historicalEndpoint).then(data => data.json());
        return {
          ...data,
          timeline: series.timeline
        }
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

img {
  width: 100%;
  height: 100%;
}

.land:hover {
  fill: #024364;
  fill-opacity: 1;
  stroke: #eb4d6c;
  stroke-opacity: 1;
  stroke-width: 1;
}

.bigger {
  font-size:50px;
}
</style>
