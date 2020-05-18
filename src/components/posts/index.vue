<template>
  <div class="hello container">
    <h1>{{ msg }}</h1>
    {{ quarter && quarter.state.value }}
    <div v-if="quarter" class="row">
      <div class="col-md-12">
        <ul>
          <li v-for="post in quarter.state.context.posts" :key="post.id">
            <a href="#" @click.prevent="send('NEW_POST.ADD', post)">
              {{ post.title }}
            </a>
          </li>
        </ul>
      </div>
      <div class="" v-if="quarter && quarter.state.matches('creating')">
        <post-view
          :post="quarter.state.context.post"
          :machine="quarter.state.context.selectedPostRef"
        >
        </post-view>
      </div>
    </div>
  </div>
</template>

<script>
import { createMachine, interpret, assign, spawn, send } from "xstate";
import PostView from "./post-view";
import postMachine from "./postMachine";

export default {
  name: "HelloWorld",
  components: {
    PostView
  },
  props: {
    msg: String
  },
  data() {
    return {
      quarter: null,
      state: null
    };
  },
  mounted() {
    const fourQuarterMachine = createMachine(
      {
        id: "posts",
        initial: "loading",
        context: {
          posts: null,
          post: null,
          selectedPostRef: null
        },
        states: {
          loading: {
            on: { CANCEL: "fail" },
            invoke: {
              id: "fetchPosts",
              src: () =>
                fetch(
                  "https://ic-goblog.herokuapp.com/api/v1/posts"
                ).then(data => data.json()),
              onDone: {
                target: "loaded",
                actions: assign({
                  posts: (context, event) => event.data
                })
              },
              onError: "fail"
            }
          },
          loaded: {
            on: {
              REFRESH: "loading",
              "NEW_POST.ADD": {
                target: "creating",
                actions: ["feedForm", "openForm"]
              }
            }
          },
          creating: {
            on: {
              "NEW_POST.SAVE": "loading",
              "NEW_POST.CLOSE": "loading"
            }
          },
          fail: {
            on: { RETRY: "loading" }
          }
        }
      },
      {
        actions: {
          feedForm: assign({
            post: (context, event) => {
              return { ...event.payload };
            },
            selectedPostRef: () => spawn(postMachine, "POST_FORM")
          }),
          openForm: send("OPEN", {
            to: context => context.selectedPostRef
          })
        }
      }
    );

    const quarterService = interpret(fourQuarterMachine)
      .onTransition(state => {
        this.state = state.value;
      })
      .start();
    this.quarter = quarterService;
  },
  methods: {
    send(eventName, params) {
      this.quarter.send({ type: eventName, payload: params });
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
