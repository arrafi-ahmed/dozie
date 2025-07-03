import {createStore} from "vuex";
import * as appUser from "./modules/appUser";
import * as user from "./modules/user";
import * as club from "./modules/club";
import * as event from "./modules/event";
import * as registration from "./modules/registration";
import * as checkin from "./modules/checkin";
import * as form from "./modules/form";

const store = createStore({
  modules: {
    appUser,
    user,
    club,
    event,
    registration,
    checkin,
    form,
  },
  state: () => ({
    progress: null,
    routeInfo: {},
  }),
  mutations: {
    setProgress(state, payload) {
      state.progress = payload;
    },
    setRouteInfo(state, payload) {
      state.routeInfo = payload;
    },
  },
  actions: {},
});

export default store;
