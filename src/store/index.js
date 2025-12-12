import { createStore } from "vuex";
import db, { auth } from "../firebase/firebaseInit";
import firebase from "firebase/app";

export default createStore({
  state: {
    invoiceData: [],
    invoiceModal: null,
    modalActive: null,
    invoicesLoaded: null,
    currentInvoiceArray: null,
    editInvoice: null,
    user: null,
    userLoggedIn: false,
  },
  mutations: {
    TOGGLE_INVOICE(state) {
      state.invoiceModal = !state.invoiceModal;
    },
    TOGGLE_MODAL(state) {
      state.modalActive = !state.modalActive;
    },
    SET_INVOICE_DATA(state, payload) {
      state.invoiceData.push(payload);
    },
    INVOICES_LOADED(state) {
      state.invoicesLoaded = true;
    },
    SET_CURRENT_INVOICE(state, payload) {
      state.currentInvoiceArray = state.invoiceData.filter((invoice) => {
        return invoice.invoiceId === payload;
      });
    },
    TOGGLE_EDIT_INVOICE(state) {
      state.editInvoice = !state.editInvoice;
    },
    DELETE_INVOICE(state, payload) {
      state.invoiceData = state.invoiceData.filter((invoice) => invoice.docId !== payload);
    },
    UPDATE_STATUS_TO_PAID(state, payload) {
      state.invoiceData.forEach((invoice) => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = true;
          invoice.invoicePending = false;
        }
      });
    },
    UPDATE_STATUS_TO_PENDING(state, payload) {
      state.invoiceData.forEach((invoice) => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = false;
          invoice.invoicePending = true;
          invoice.invoiceDraft = false;
        }
      });
    },
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_USER_LOGGED_IN(state, payload) {
      state.userLoggedIn = payload;
    },
    CLEAR_USER(state) {
      state.user = null;
      state.userLoggedIn = false;
      state.invoiceData = [];
      state.invoicesLoaded = null;
    },
    CLEAR_INVOICE_DATA(state) {
      state.invoiceData = [];
    },
  },
  actions: {
    async GET_USER({ commit }) {
      return new Promise((resolve) => {
        auth.onAuthStateChanged((user) => {
          if (user) {
            commit("SET_USER", {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
            });
            commit("SET_USER_LOGGED_IN", true);
          } else {
            commit("CLEAR_USER");
          }
          resolve(user);
        });
      });
    },
    async SIGN_IN_EMAIL({ commit }, { email, password }) {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      commit("SET_USER", {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      });
      commit("SET_USER_LOGGED_IN", true);
      return user;
    },
    async REGISTER_EMAIL({ commit }, { email, password }) {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      commit("SET_USER", {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      });
      commit("SET_USER_LOGGED_IN", true);
      return user;
    },
    async SIGN_IN_GOOGLE({ commit }) {
      const provider = new firebase.auth.GoogleAuthProvider();
      const userCredential = await auth.signInWithPopup(provider);
      const user = userCredential.user;
      commit("SET_USER", {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      });
      commit("SET_USER_LOGGED_IN", true);
      return user;
    },
    async SIGN_IN_ANONYMOUS({ commit }) {
      const userCredential = await auth.signInAnonymously();
      const user = userCredential.user;
      commit("SET_USER", {
        uid: user.uid,
        email: null,
        displayName: "Anonymous User",
      });
      commit("SET_USER_LOGGED_IN", true);
      return user;
    },
    async SIGN_OUT({ commit }) {
      await auth.signOut();
      commit("CLEAR_USER");
    },
    async GET_INVOICES({ commit, state }) {
      if (!state.user || !state.user.uid) {
        return;
      }
      commit("CLEAR_INVOICE_DATA");
      const getData = db.collection("invoices").where("userId", "==", state.user.uid);
      const results = await getData.get();
      results.forEach((doc) => {
        const data = {
          docId: doc.id,
          invoiceId: doc.data().invoiceId,
          userId: doc.data().userId,
          billerStreetAddress: doc.data().billerStreetAddress,
          billerCity: doc.data().billerCity,
          billerZipCode: doc.data().billerZipCode,
          billerCountry: doc.data().billerCountry,
          clientName: doc.data().clientName,
          clientEmail: doc.data().clientEmail,
          clientStreetAddress: doc.data().clientStreetAddress,
          clientCity: doc.data().clientCity,
          clientZipCode: doc.data().clientZipCode,
          clientCountry: doc.data().clientCountry,
          invoiceDateUnix: doc.data().invoiceDateUnix,
          invoiceDate: doc.data().invoiceDate,
          paymentTerms: doc.data().paymentTerms,
          paymentDueDateUnix: doc.data().paymentDueDateUnix,
          paymentDueDate: doc.data().paymentDueDate,
          productDescription: doc.data().productDescription,
          invoiceItemList: doc.data().invoiceItemList,
          invoiceTotal: doc.data().invoiceTotal,
          invoicePending: doc.data().invoicePending,
          invoiceDraft: doc.data().invoiceDraft,
          invoicePaid: doc.data().invoicePaid,
        };
        commit("SET_INVOICE_DATA", data);
      });
      commit("INVOICES_LOADED");
    },
    async UPDATE_INVOICE({ commit, dispatch }, { docId, routeId }) {
      commit("DELETE_INVOICE", docId);
      await dispatch("GET_INVOICES");
      commit("TOGGLE_INVOICE");
      commit("TOGGLE_EDIT_INVOICE");
      commit("SET_CURRENT_INVOICE", routeId);
    },
    async DELETE_INVOICE({ commit, state }, docId) {
      if (!state.user || !state.user.uid) {
        throw new Error("User not authenticated");
      }
      const invoiceRef = db.collection("invoices").doc(docId);
      const invoiceDoc = await invoiceRef.get();
      if (!invoiceDoc.exists) {
        throw new Error("Invoice not found");
      }
      if (invoiceDoc.data().userId !== state.user.uid) {
        throw new Error("You don't have permission to delete this invoice");
      }
      await invoiceRef.delete();
      commit("DELETE_INVOICE", docId);
    },
    async UPDATE_STATUS_TO_PAID({ commit, state }, docId) {
      if (!state.user || !state.user.uid) {
        throw new Error("User not authenticated");
      }
      const invoiceRef = db.collection("invoices").doc(docId);
      const invoiceDoc = await invoiceRef.get();
      if (!invoiceDoc.exists) {
        throw new Error("Invoice not found");
      }
      if (invoiceDoc.data().userId !== state.user.uid) {
        throw new Error("You don't have permission to modify this invoice");
      }
      await invoiceRef.update({
        invoicePaid: true,
        invoicePending: false,
      });
      commit("UPDATE_STATUS_TO_PAID", docId);
    },
    async UPDATE_STATUS_TO_PENDING({ commit, state }, docId) {
      if (!state.user || !state.user.uid) {
        throw new Error("User not authenticated");
      }
      const invoiceRef = db.collection("invoices").doc(docId);
      const invoiceDoc = await invoiceRef.get();
      if (!invoiceDoc.exists) {
        throw new Error("Invoice not found");
      }
      if (invoiceDoc.data().userId !== state.user.uid) {
        throw new Error("You don't have permission to modify this invoice");
      }
      await invoiceRef.update({
        invoicePaid: false,
        invoicePending: true,
        invoiceDraft: false,
      });
      commit("UPDATE_STATUS_TO_PENDING", docId);
    },
  },
  modules: {},
});