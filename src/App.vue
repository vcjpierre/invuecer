<template>
  <div v-if="authLoading" class="loading-container flex flex-column">
    <div class="loading-spinner"></div>
    <p>Cargando...</p>
  </div>
  <div v-else-if="userLoggedIn && invoicesLoaded">
    <div v-if="!mobile" class="app flex flex-column">
      <Navigation />
      <div class="app-content flex flex-column">
        <Modal v-if="modalActive" />
        <transition name="invoice">
          <InvoiceModal v-if="invoiceModal" />
        </transition>
        <router-view />
      </div>
    </div>
    <div v-else class="mobile-message flex flex-column">
      <h2>Sorry, this app is not supported on Mobile Devices</h2>
      <p>To use this app, please use a computer or Tablet</p>
    </div>
  </div>
  <div v-else>
    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Navigation from "./components/Navigation";
import InvoiceModal from "./components/InvoiceModal";
import Modal from "./components/Modal";
export default {
  data() {
    return {
      mobile: null,
      authLoading: true,
    };
  },
  components: {
    Navigation,
    InvoiceModal,
    Modal,
  },
  async created() {
    await this.GET_USER();
    this.checkScreen();
    window.addEventListener("resize", this.checkScreen);
    if (this.userLoggedIn) {
      await this.GET_INVOICES();
    }
    this.authLoading = false;
  },
  watch: {
    async userLoggedIn(newValue) {
      if (newValue && !this.invoicesLoaded) {
        await this.GET_INVOICES();
      }
    },
  },
  methods: {
    ...mapActions(["GET_INVOICES", "GET_USER"]),
    checkScreen() {
      const windowWidth = window.innerWidth;
      if (windowWidth <= 750) {
        this.mobile = true;
        return;
      }
      this.mobile = false;
    },
  },
  computed: {
    ...mapState(["invoiceModal", "modalActive", "invoicesLoaded", "userLoggedIn"]),
  },
};
</script>

<style lang="css">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

.app {
  background-color: #141625;
  min-height: 100vh;
}

@media (min-width: 900px) {
  .app {
    flex-direction: row !important;
  }
}

.app .app-content {
  padding: 0 20px;
  flex: 1;
  position: relative;
}

.mobile-message {
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #141625;
  color: #fff;
}

.mobile-message p {
  margin-top: 16px;
}

.invoice-enter-active,
.invoice-leave-active {
  transition: 0.8s ease all;
}

.invoice-enter-from,
.invoice-leave-to {
  transform: translateX(-700px);
}

button,
.button {
  cursor: pointer;
  padding: 16px 24px;
  border-radius: 30px;
  border: none;
  font-size: 12px;
  margin-right: 8px;
  color: #fff;
}

.dark-purple {
  background-color: #252945;
}

.red {
  background-color: #ec5757;
}

.purple {
  background-color: #7c5dfa;
}

.green {
  background-color: #33d69f;
}

.orange {
  background-color: #ff8f00;
}

.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.container {
  width: 100%;
  padding: 40px 10px;
  max-width: 850px;
  margin: 0 auto;
}

@media (min-width: 900px) {
  .container {
    padding-top: 72px;
  }
}

.nav-link {
  text-decoration: none;
  color: initial;
}

.status-button {
  font-size: 12px;
  margin-right: 30px;
  align-items: center;
  padding: 8px 30px;
  border-radius: 10px;
}

.status-button::before {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.paid {
  color: #33d69f;
  background-color: rgba(51, 214, 160, 0.1);
}

.paid::before {
  background-color: #33d69f;
}

.pending {
  color: #ff8f00;
  background-color: rgba(255, 145, 0, 0.1);
}

.pending::before {
  background-color: #ff8f00;
}

.draft {
  color: #dfe3fa;
  background-color: rgba(223, 227, 250, 0.1);
}

.draft::before {
  background-color: #dfe3fa;
}

.loading-container {
  min-height: 100vh;
  background-color: #141625;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #252945;
  border-top: 4px solid #7c5dfa;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  font-size: 14px;
  color: #dfe3fa;
}
</style>