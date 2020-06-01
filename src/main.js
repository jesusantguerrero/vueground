import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import vueKanban from "vue-kanban";
import "vue-kanban/src/assets/kanban.css";

Vue.config.productionTip = false;
Vue.use(vueKanban);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
