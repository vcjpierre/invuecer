<template>
  <header class="flex flex-column">
    <div class="branding flex">
      <img src="@/assets/file-invoice-dollar-solid.png" alt="" />
    </div>
    <div class="user-section flex flex-column">      
      <button @click="signOut" class="logout-button">Sign Out</button>
    </div>
  </header>
</template>

<script lang="js">
import { mapActions, mapState } from "vuex";
export default {
  name: "navigation",
  methods: {
    ...mapActions(["SIGN_OUT"]),
    async signOut() {
      try {
        await this.SIGN_OUT();
        this.$router.push("/login");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    },
  },
  computed: {
    ...mapState(["user"]),
  },
};
</script>

<style lang="css" scoped>
header {
  z-index: 99;
  flex-direction: row;
  background-color: #1e2139;
}

@media (min-width: 900px) {
  header {
    min-height: 100%;
    min-width: 90px;
    flex-direction: column;
    border-radius: 0 20px 20px 0;
    justify-content: space-between;
  }
}

header .branding {
  border-radius: 0 20px 20px 0;
  background-color: #7c5dfa;
  justify-content: center;
  padding: 24px;
}

@media (min-width: 900px) {
  header .branding {
    width: 100%;
  }
}

header .branding img {
  width: auto;
  height: 30px;
}

.user-section {
  padding: 20px;
  align-items: center;
  gap: 12px;
}

.user-info {
  width: 100%;
  text-align: center;
}

.user-email {
  color: #dfe3fa;
  font-size: 11px;
  word-break: break-word;
  margin-bottom: 12px;
}

.logout-button {
  width: 100%;
  padding: 10px;
  background-color: #ec5757;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 11px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #d14545;
}

@media (max-width: 899px) {
  .user-section {
    display: none;
  }
}
</style>