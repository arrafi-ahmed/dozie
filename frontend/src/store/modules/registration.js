import $axios from "@/plugins/axios";
import fileSaver from "file-saver";
import {deepMerge} from "@/others/util";

export const namespaced = true;

export const state = {
  registration: {},
  attendees: [],
};

export const mutations = {
  setRegistration(state, payload) {
    state.registration = payload;
  },
  resetRegistration(state) {
    state.registration = {};
  },
  setAttendees(state, payload) {
    state.attendees = payload;
  },
  updateAttendee(state, payload) {
    const foundIndex = state.attendees.findIndex(
      (item) => item.registration.id == payload.registration.id,
    );
    if (foundIndex !== -1) {
      deepMerge(state.attendees[foundIndex], payload);
    }
  },
  removeRegistration(state, payload) {
    const foundIndex = state.attendees.findIndex((item) => item.rId == payload);
    if (foundIndex !== -1) {
      state.attendees.splice(foundIndex, 1);
    }
  },
};

export const actions = {
  bulkImportAttendee({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .post("/api/registration/bulkImportAttendee", request)
        .then((response) => {
          resolve(response.data?.payload);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  initRegistration({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .post("/api/registration/initRegistration", request)
        .then((response) => {
          commit("setRegistration", response.data?.payload);
          resolve(response.data?.payload);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  saveRegistration({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .post("/api/registration/save", request)
        .then((response) => {
          commit("setRegistration", response.data?.payload);
          resolve(response.data?.payload);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  setRegistration({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/registration/getRegistration", {
          params: {
            registrationId: request.registrationId,
            qrUuid: request.qrUuid,
          },
        })
        .then((response) => {
          commit("setRegistration", response.data?.payload);
          resolve(response.data?.payload);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  setAttendees({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/registration/getAttendees", {
          params: {
            eventId: request.eventId,
            searchKeyword: request.searchKeyword,
            sortBy: request?.sortBy,
          },
        })
        .then((response) => {
          commit("setAttendees", response.data?.payload);
          resolve(response.data?.payload);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  downloadAttendees({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/registration/downloadAttendees", {
          params: {
            eventId: request.eventId,
          },
          responseType: "blob",
        })
        .then((response) => {
          const filename = `Attendee-report-event-${
            request.eventId
          }-${new Date().toISOString().slice(0, 19)}.xlsx`;

          const blob = new Blob([response.data], {type: response.data.type});
          fileSaver.saveAs(blob, filename);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  sendTicket({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/registration/sendTicket", {
          params: {
            registrationId: request.registrationId,
            eventId: request.eventId,
          },
        })
        .then((response) => {
          resolve(response.data?.payload);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  removeRegistration({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/registration/removeRegistration", {
          params: {
            registrationId: request.registrationId,
            eventId: request.eventId,
          },
        })
        .then((response) => {
          commit("removeRegistration", request.registrationId);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getPaymentStatus({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/stripe/sessionStatus", {
          params: {
            sessionId: request.sessionId,
          },
        })
        .then((response) => {
          resolve(response.data?.payload);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  updateStatus({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .post("/api/registration/updateStatus", request)
        .then((response) => {
          resolve(response.data?.payload);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  createCheckout({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .post("/api/stripe/createCheckout", request)
        .then((response) => {
          // commit("setRegistration", response.data?.payload);
          resolve(response.data?.payload);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  scanByExtrasPurchaseId({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .post("/api/registration/scanByExtrasPurchaseId", {payload: request})
        .then((response) => {
          // commit("setRegistration", response.data?.payload);
          resolve(response.data?.payload);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export const getters = {};
