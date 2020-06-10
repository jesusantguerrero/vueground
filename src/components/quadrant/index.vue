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
        <quadrant-form @save="addQuadrantItem" :user="state.context.user">
        </quadrant-form>
      </div>
      <div class="d-flex justify-content-between">
      </div>
      <kanban-data
        ref="Kanban"
        :data="list"
        :committed="yerterday"
        @changed="updateStatus"
        @deleted="deleteItem"
        @complete-day="completeDay"
      ></kanban-data>
    </div>
  </div>
</template>

<script>
import { interpret } from "xstate";
import { subDays } from "date-fns";
import appMachine from "./appMachine";
import Layout from "@/components/quadrant/layout";
import KanbanData from "./kanban";
import QuadrantForm from "./quadrant-form";

import firebase from "firebase/app";
import "firebase/auth";
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
      userQuadrant: null,
      list: [],
      yerterday: [],
      formData: {}
    };
  },
  watch: {
    "state.value": {
      handler(state) {
        if (state == "unauthenticated") {
          this.list = [];
          this.yerterday = [];
          this.initFirebaseAuth();
        }

        if (state == "authenticated") {
          this.getList();
          this.preStartDay();
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
                user.uid = result.user.uid;
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
      this.userQuadrant = db
        .ref(`quadrantTasks`)
        .child(this.state.context.user.uid);
      this.userQuadrant
        .child(item.id)
        .set(item)
        .then(() => {
          this.isLoading = false;
        })
        .catch(e => {
          console.log(e);
        });
    },

    updateStatus(item) {
      return db
        .ref(`quadrantTasks/${this.state.context.user.uid}/${item.id}`)
        .update(item);
    },

    deleteItem(item) {
      return db
        .ref(`quadrantTasks/${this.state.context.user.uid}/${item.id}`)
        .remove()
    },

    completeDay() {
      this.isLoading = true;
      const yesterday = subDays(new Date(), 1)
        .toISOString()
        .slice(0, 10);
      const now = new Date().toISOString().slice(0, 10);
      let completed = this.list.filter(item => item.done);
      completed = completed.map(item => {
        item.commit = true;
        item.commitDate = yesterday;
        return item;
      });

      completed.forEach(async item => {
        await this.updateStatus(item);
      });

      const quadrantDailyRef = db.ref(
        `quadrantDaily/${this.state.context.user.uid}`
      );

      quadrantDailyRef.child(now).set({
        date: now
      });
      this.isLoading = false;
    },

    getList() {
      const yesterday = subDays(new Date(), 1)
        .toISOString()
        .slice(0, 10);
      const quadrantTasksRef = db.ref(
        `quadrantTasks/${this.state.context.user.uid}`
      );

      const daily = quadrantTasksRef.orderByChild("commit").equalTo(false);

      daily.on("child_added", data => {
        this.list.push(data.val());
      });

      daily.on("child_removed", data => {
        const index = this.list.findIndex(item => item.id == data.key);
        this.list.splice(index, 1);
      })

      daily.on("child_changed", data => {
        const itemChanged = data.val();
        const index = this.list.findIndex(item => item.id == itemChanged.id);
        this.$set(this.list, index, itemChanged);
      });

      const completedYesterday = quadrantTasksRef
        .orderByChild("commitDate")
        .equalTo(yesterday);
      completedYesterday.on("child_added", data => {
        this.yerterday.push(data.val());
      });
    },

    clearForm() {
      this.formData = {};
    },

    openStartDay() {
      alert("Start a new date");
    },

    preStartDay() {
      const quadrantDailyRef = db.ref(
        `quadrantDaily/${this.state.context.user.uid}`
      );

      const today = quadrantDailyRef
        .orderByChild("date")
        .equalTo(new Date().toISOString().slice(0, 10));

      today.on("value", todayDaily => {
        console.log(todayDaily.val(), "hola");
        if (!todayDaily.val()) {
          this.$refs.Kanban.openDialog();
        }
      });
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
