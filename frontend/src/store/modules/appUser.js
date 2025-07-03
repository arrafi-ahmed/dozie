import $axios from "@/plugins/axios";

export const namespaced = true;

export const state = {
  admins: [],
};

export const mutations = {
  setAdmins(state, payload) {
    state.admins = payload;
  },
  addAdmin(state, payload) {
    state.admins.unshift(payload);
  },
  editAdmin(state, payload) {
    const foundIndex = state.admins.findIndex((item) => item.id == payload.id);
    if (foundIndex !== -1) state.admins[foundIndex] = payload;
  },
};

export const actions = {
  saveAppUser({commit}, request) {
    const commitName =
      (request.user.id ? "edit" : "add") +
      (request.user.role.toLowerCase() === "admin" ? "Admin" : null);
    return new Promise((resolve, reject) => {
      $axios
        .post("/appUser/save", {payload: request.user})
        .then((response) => {
          commit(commitName, {
            ...response.data?.payload,
          });
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  setAppUsers({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/appUser/getAppUsers", {
          params: {clubId: request},
        })
        .then((response) => {
          commit("setAdmins", response.data?.payload?.admins);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export const getters = {};
