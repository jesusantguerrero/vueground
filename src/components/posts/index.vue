<template>
  <div class="hello container">
    <h1 class="pb-5 pt-5">
      Posts

      <small> [app state: {{ postApp && postApp.state.value }}] </small>
    </h1>

    <div v-if="postApp" class="row">
      <div class="col-md-12" v-if="!postApp.state.matches('creating')">
        <!-- Add Post button -->
        <div class="text-right">
          <button
            class="btn btn-primary mr-2"
            @click.prevent="send('POST.ADD')"
          >
            Add Post
          </button>
        </div>
        <!--  End of add post -->

        <!-- List -->
        <ul class="post-list">
          <li
            v-for="post in postApp.state.context.posts"
            :key="post.id"
            class="post-list__item"
          >
            <a href="#" @click.prevent="send('POST.EDIT', post)">
              <h4>
                {{ post.title }}
              </h4>
            </a>
          </li>
        </ul>
        <!-- End of post list -->
      </div>

      <!-- Post creation view -->
      <div
        class="col-md-12"
        v-if="postApp && postApp.state.matches('creating')"
      >
        <post-view
          :post="postApp.state.context.post"
          :machine="postApp.state.context.selectedPostRef"
        >
        </post-view>
      </div>
      <!-- end of Post creation view -->
    </div>
  </div>
</template>

<script>
import { interpret } from "xstate";
import PostView from "./post-view";
import appMachine from "./appMachine";

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
      postApp: null,
      state: null
    };
  },
  mounted() {
    const postAppService = interpret(appMachine)
      .onTransition(state => {
        this.state = state.value;
      })
      .start();
    this.postApp = postAppService;
  },
  methods: {
    send(eventName, params) {
      this.postApp.send({ type: eventName, payload: params });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
$foreColor: #a9a9b3;

html,
body {
  background: #292a2d !important;
  color: foreColor;
}

h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
}

li {
  display: inline-block;
  margin: 10px;
  height: 60px;
}
a {
  color: white;
  padding: 15px;
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  background: rgba($color: white, $alpha: 0.2);
  &:hover {
    color: white;
    background: rgba($color: white, $alpha: 0.3);
    text-decoration: none;
  }
}

.selected {
  color: dodgerblue;
}
</style>
