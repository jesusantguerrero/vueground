import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/posts",
      name: "posts",
      component: () =>
        import(/* webpackChunkName: "posts" */ "./views/Posts.vue")
    },
    {
      path: "/quadrant",
      name: "quadrant",
      component: () =>
        import(/** WebpackChunckName "quadrant"*/ "./views/Quadrant.vue")
    }
  ]
});
