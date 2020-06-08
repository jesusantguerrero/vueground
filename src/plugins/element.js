import Vue from "vue";
import {
  Button,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Avatar,
  Dialog
} from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import lang from "element-ui/lib/locale/lang/en";
import locale from "element-ui/lib/locale";

locale.use(lang);

Vue.use(Button);
Vue.use(Menu);
Vue.use(Dialog);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Submenu);
Vue.use(Avatar);
