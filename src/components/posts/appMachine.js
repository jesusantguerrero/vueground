import { createMachine, assign, spawn, send } from "xstate";
import postMachine from "./postMachine";

const appMachine = createMachine(
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
            fetch("https://ic-goblog.herokuapp.com/api/v1/posts").then(data =>
              data.json()
            ),
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
          "POST.EDIT": {
            target: "creating",
            actions: ["feedForm", "openForm"]
          },
          "POST.ADD": {
            target: "creating",
            actions: ["feedFormCreate", "openForm"]
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
      feedFormCreate: assign({
        post: () => {
          return {};
        },
        selectedPostRef: () => spawn(postMachine, "POST_FORM")
      }),
      openForm: send("OPEN", {
        to: context => context.selectedPostRef
      })
    }
  }
);

export default appMachine;
