import $axios from "@/plugins/axios";

export const namespaced = true;

export const state = {
  clubs: [],
  club: {},
};

export const mutations = {
  setClubs(state, payload) {
    state.clubs = payload;
  },
  setClub(state, payload) {
    state.club = payload;
  },
  saveClub(state, payload) {
    const foundIndex = state.clubs.findIndex((item) => item.id == payload.id);
    if (foundIndex !== -1) {
      state.clubs[foundIndex] = payload;
    } else {
      state.clubs.unshift(payload);
    }
  },
  removeClub(state, payload) {
    const foundIndex = state.clubs.findIndex(
      (item) => item.id == payload.clubId,
    );
    if (foundIndex !== -1) {
      state.clubs.splice(foundIndex, 1);
    }
  },
};

export const actions = {
  setClubs({commit}) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/club/getAllClubs")
        .then((response) => {
          commit("setClubs", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  setClub({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/club/getClub", {params: {clubId: request}})
        .then((response) => {
          commit("setClub", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  save({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .post("/club/save", request)
        .then((response) => {
          commit("saveClub", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  removeClub({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/club/removeClub", {
          params: {clubId: request.clubId},
        })
        .then((response) => {
          commit("removeClub", request);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export const getters = {
  getClubById: (state) => (id) => {
    return state.clubs.find((item) => item.id == id);
  },
};
