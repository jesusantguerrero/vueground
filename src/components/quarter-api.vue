<template>
  <div class="hello container">
    <h1>{{ msg }}</h1>
    <div>
      {{ postService.state.context.posts }}
    </div>
    <button class="btn btn-primary" @click="toggleState">
      <i
        class="fa fa-spinner fa-spin"
        v-if="postService && postService.state.matches('loading')"
      ></i>
      Get Data
    </button>
  </div>
</template>

<script>
import { createMachine, interpret, assign } from "xstate";

export default {
  name: "PostsMachine",
  props: {
    msg: String
  },
  data() {
    return {
      postService: null,
      state: null,
      postApiEndpint:
        "https://corona.lmao.ninja/v2/countries/dominican%20republic?yesterday=true&strict=true"
    };
  },
  created() {
    const postMachine = createMachine({
      id: "goblog",
      initial: "idle",
      context: {
        posts: null
      },
      states: {
        idle: {
          on: { FETCH: "loading" }
        },
        loading: {
          invoke: {
            id: "fetchPosts",
            src: () => fetch(this.postApiEndpint).then(data => data.json()),
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
        console.log(this.postService)
      })
      .start();
    this.postService = postService;
  },
  methods: {
    toggleState() {
      this.postService.send("FETCH");
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
