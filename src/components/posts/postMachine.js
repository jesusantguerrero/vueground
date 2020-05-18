import { createMachine, sendParent } from "xstate";
const endpoint = "https://ic-goblog.herokuapp.com/api/v1/posts";

const machine = {
  id: "post",
  initial: "idle",
  context: {
    post: null
  },
  states: {
    idle: {
      on: {
        OPEN: "creating"
      }
    },
    creating: {
      on: {
        SAVE: "saving",
        CANCEL: "closed"
      }
    },
    saving: {
      on: { CANCEL: "creating" },
      invoke: {
        id: "submitPost",
        src: (context, event) => {
          let url = endpoint;
          let method = "POST";

          if (event.payload.id) {
            url += `/${event.payload.id}`;
            method = "PUT";
          }
          return fetch(url, {
            method,
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(event.payload)
          }).then(data => data.json());
        },
        onDone: {
          target: "closed",
          actions: (context, event) => {
            if (event.data && !event.data.message) {
              sendParent("NEW_POST.SAVE");
            } else {
              throw event.data.message;
            }
          }
        },
        onError: "creating"
      }
    },
    closed: {
      target: "idle",
      entry: sendParent("NEW_POST.CLOSE")
    }
  }
};

export default createMachine(machine);
