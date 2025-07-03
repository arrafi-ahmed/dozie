import $axios from "@/plugins/axios";

export const namespaced = true;

export const state = {
  formQuestions: [],
};

export const mutations = {
  setFormQuestions(state, payload) {
    state.formQuestions = payload;
  },
};

export const actions = {
  setFormQuestions({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/form/getFormQuestions", {
          params: {
            eventId: request.eventId,
          },
        })
        .then((response) => {
          commit("setFormQuestions", response.data?.payload);
          resolve(response.data?.payload);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  save({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .post("/form/save", {payload: request})
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export const getters = {};
