<template>
  <div>
    <layout
      :user="state.context && state.context.user"
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
      </div>
    </div>

    <div v-if="matches('authenticated')" class="text-primary container-fluid">
      <div class="d-flex justify-content-center">
        <quadrant-form @save="addQuadrantItem" :user="state.context.user"> </quadrant-form>
      </div>
      <div class="d-flex justify-content-between">
        <h2>Quadrant Technique</h2>
        <button class="btn btn-primary"> Complete Day</button>
      </div>
      <kanban-data :data="list" @changed="updateStatus"></kanban-data>
    </div>
  </div>
</template>

<script>
import { interpret } from "xstate";
import appMachine from "./appMachine";
import Layout from "@/components/quadrant/layout";
import KanbanData from "./kanban";
import QuadrantForm from "./QuadrantForm";

import * as firebase from "firebase";
import "firebase/database";
import * as firebaseui from "firebaseui";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: "ic-quadrant.firebaseapp.com",
  databaseURL: "https://ic-quadrant.firebaseio.com",
  projectId: "ic-quadrant",
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE,
  messagingSenderId: process.env.VUE_APP_MESSAGE_SENDER,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: "G-VFBCE4GTYC"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const ui = new firebaseui.auth.AuthUI(firebase.auth());
const uiConfig = {
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ]
};
export default {
  components: {
    Layout,
    KanbanData,
    QuadrantForm
  },
  data() {
    return {
      quadrantApp: null,
      state: {},
      isLoading: false,
      list: [],
      formData: {}
    };
  },
  watch: {
    "state.value": {
      handler(state) {
        if (state == "unauthenticated") {
          this.initFirebaseAuth();
        }

        if (state == "authenticated") {
          this.getList();
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.initMachine();
  },
  methods: {
    initMachine() {
      const quadrantAppService = interpret(appMachine)
        .onTransition(state => {
          this.state = state;
        })
        .start();

      this.quadrantApp = quadrantAppService;
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
    },

    initFirebaseAuth() {
      setTimeout(() => {
        try {
          ui.start("#auth-container", {
            signInOptions: uiConfig.signInOptions,
            siteName: "Vueground",
            callbacks: {
              signInSuccessWithAuthResult: result => {
                const user = result.additionalUserInfo.profile;
                this.send("SET_USER", user);
                this.send("LOGIN");
                return false;
              }
            },
            signInFlow: "popup",
            signInSuccessUrl: "/quadrant"
          });
        } catch (e) {}
      }, 1000);
    },

    addQuadrantItem(item) {
      this.isLoading = true;
      db.ref(`quadrantTasks/${this.state.context.user.id}`)
        .child(item.id)
        .set(item)
        .then(() => {
          this.isLoading = false;
        })
        .catch(() => {});
    },

    updateStatus(item) {
      db.ref(`quadrantTasks/${this.state.context.user.id}/${item.id}`).update(item);
    },

    getList() {
      const quadrantTasksRef = db.ref(`quadrantTasks/${this.state.context.user.id}`);
      quadrantTasksRef.on("child_added", data => {
        this.list.push(data.val());
      });
    },

    clearForm() {
      this.formData = {};
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
