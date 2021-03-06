import { createMachine, assign } from "xstate";

const appMachine = createMachine(
  {
    id: "quadrant",
    initial: "loading",
    context: {
      user: null,
      token: null
    },
    states: {
      loading: {
        on: {
          FETCH_TOKEN: {
            target: "assigning",
            actions: ["getToken"]
          }
        }
      },
      assigning: {
        on: {
          "": [
            {
              target: "authenticated",
              cond: "isAuthenticated"
            },
            {
              target: "unauthenticated"
            }
          ]
        }
      },
      authenticated: {
        on: {
          LOGOUT: {
            target: "assigning"
          }
        },
        exit: ["logout"]
      },
      unauthenticated: {
        entry: ["initFirebaseAuth"],
        on: {
          SET_USER: {
            actions: ["setUser"]
          },
          LOGIN: "authenticated"
        }
      }
    }
  },
  {
    actions: {
      setUser: assign({
        user: (context, event) => {
          const user = event.payload ? event.payload : null;
          localStorage.setItem("firebaseui::currentUser", JSON.stringify(user));
          return user;
        }
      }),
      getToken: assign({
        user: () => {
          const user = localStorage.getItem("firebaseui::currentUser");
          return user ? JSON.parse(user) : null;
        }
      }),
      logout: assign({
        user: () => {
          localStorage.removeItem("firebaseui::currentUser");
          return null;
        }
      })
    },
    guards: {
      isAuthenticated(context) {
        const result = Boolean(context.user);
        return result;
      }
    }
  }
);

export default appMachine;
