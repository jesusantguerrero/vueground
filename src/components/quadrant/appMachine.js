import { createMachine, assign, interpret } from "xstate";
import * as firebase from "firebase";
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
const ui = new firebaseui.auth.AuthUI(firebase.auth());
const uiConfig = {
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ]
};

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
          },
          AUTHENTICATE: {
            target: "assigning",
            actions: ["setUser"]
          },
          NO_TOKEN: {
            target: {
              target: "unauthenticated"
            }
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
            target: "assigning",
            actions: ["logout"]
          }
        }
      },
      unauthenticated: {
        entry: ["initFirebaseAuth"],
        on: {
          LOGIN: {
            target: "authenticated",
            actions: ["setUser"]
          }
        }
      }
    }
  },
  {
    actions: {
      setUser: assign({
        user: (context, event) => {
          const user = event.payload.user;
          localStorage.setItem("quadrant-user", JSON.stringify(user));
          return user;
        },
        token: (context, event) => {
          const token = event.payload.token;
          localStorage.setItem("quadrant-user", JSON.stringify(token));
          return token;
        }
      }),
      getToken: assign({
        user: () => {
          const user = localStorage.getItem("firebaseui::rememberedAccounts");
          return user ? JSON.parse(user)[0] : null;
        }
      }),
      logout: assign({
        user: () => {
          localStorage.removeItem("firebaseui::rememberedAccounts");
          return null;
        }
      }),
      initFirebaseAuth() {
        setTimeout(() => {
          try {
            ui.start("#auth-container", {
              signInOptions: uiConfig.signInOptions,
              siteName: "Vueground",
              callbacks: {
                signInSuccessWithAuthResult: result => {
                  const user = result.additionalUserInfo.profile;
                  sendAuthorize(user);
                  return false;
                }
              },
              signInFlow: "popup",
              signInSuccessUrl: "/quadrant"
            });
          } catch (e) {
            console.log(e);
          }
        }, 200);
      }
    },
    guards: {
      isAuthenticated(context) {
        return context.user;
      }
    }
  }
);

function sendAuthorize(user) {
  quadrantAppService.send({ type: "LOGIN", payload: user });
}

const quadrantAppService = interpret(appMachine);

export default quadrantAppService;
