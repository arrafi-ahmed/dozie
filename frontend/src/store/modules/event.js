import $axios from "@/plugins/axios";

export const namespaced = true;

export const state = {
  events: [],
  event: {},
  extras: [],
};

export const mutations = {
  setEvents(state, payload) {
    state.events = payload;
  },
  setEvent(state, payload) {
    state.event = payload;
  },
  saveEvent(state, payload) {
    const foundIndex = state.events.findIndex((item) => item.id == payload.id);
    if (foundIndex !== -1) {
      state.events[foundIndex] = payload;
    } else {
      state.events.unshift(payload);
    }
  },
  saveExtras(state, payload) {
    const foundIndex = state.extras.findIndex((item) => item.id == payload.id);
    if (foundIndex !== -1) {
      state.extras[foundIndex] = payload;
    } else {
      state.extras.unshift(payload);
    }
  },
  removeEvent(state, payload) {
    const foundIndex = state.events.findIndex(
      (item) => item.id == payload.eventId,
    );
    if (foundIndex !== -1) {
      state.events.splice(foundIndex, 1);
    }
  },
  removeExtras(state, payload) {
    const foundIndex = state.extras.findIndex(
      (item) => item.id == payload.extrasId,
    );
    if (foundIndex !== -1) {
      state.extras.splice(foundIndex, 1);
    }
  },
  setExtras(state, payload) {
    state.extras = payload;
  },
};

export const actions = {
  setEvents({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/event/getAllEvents", {params: {clubId: request}})
        .then((response) => {
          commit("setEvents", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  setActiveEvents({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/event/getAllActiveEvents", {
          params: {
            clubId: request.clubId,
            currentDate: request.currentDate,
          },
        })
        .then((response) => {
          commit("setEvents", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  setEvent({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/event/getEvent", {
          params: {eventId: request.eventId},
        })
        .then((response) => {
          commit("setEvent", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  setEventByEventIdnClubId({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/event/getEventByEventIdnClubId", {
          params: {eventId: request.eventId, clubId: request.clubId},
        })
        .then((response) => {
          commit("setEvent", response.data?.payload);
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
        .post("/event/save", request)
        .then((response) => {
          commit("saveEvent", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  removeEvent({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/event/removeEvent", {
          params: {eventId: request.eventId},
        })
        .then((response) => {
          commit("removeEvent", request);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  removeExtras({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/event/removeExtras", {
          params: {extrasId: request.extrasId, eventId: request.eventId},
        })
        .then((response) => {
          commit("removeExtras", request);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  saveExtras({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .post("/event/saveExtras", request)
        .then((response) => {
          commit("saveExtras", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  setExtras({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/event/getExtras", {params: {eventId: request}})
        .then((response) => {
          commit("setExtras", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export const getters = {
  getEventById: (state) => (id) => {
    return state.events.find((item) => item.id == id);
  },
  isEventFree: () => {
  },
};
