<template>
  <div class="login-container flex flex-column">
    <div class="login-card">
      <div class="branding flex">
        <img src="@/assets/file-invoice-dollar-solid.png" alt="" />
        <h1>Invoice App</h1>
      </div>
      <div class="login-form flex flex-column">
        <h2>Sign In</h2>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <div class="input-group flex flex-column">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="your@email.com"
            required
          />
        </div>
        <div class="input-group flex flex-column">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="••••••••"
            required
          />
        </div>
        <button @click="signInWithEmail" class="purple" :disabled="loading">
          {{ loading ? "Loading..." : "Sign In with Email" }}
        </button>
        <div class="divider flex">
          <span>or</span>
        </div>
        <button @click="signInWithGoogle" class="dark-purple" :disabled="loading">
          Sign In with Google
        </button>
        <button @click="signInAnonymously" class="orange" :disabled="loading">
          Continue as Anonymous
        </button>
        <div class="register-link">
          <p>Don't have an account? <a @click="showRegister = true">Sign up here</a></p>
        </div>
        <div v-if="showRegister" class="register-section flex flex-column">
          <h3>Create Account</h3>
          <div class="input-group flex flex-column">
            <label for="registerEmail">Email</label>
            <input
              type="email"
              id="registerEmail"
              v-model="registerEmail"
              placeholder="your@email.com"
              required
            />
          </div>
          <div class="input-group flex flex-column">
            <label for="registerPassword">Password</label>
            <input
              type="password"
              id="registerPassword"
              v-model="registerPassword"
              placeholder="Minimum 6 characters"
              required
            />
          </div>
          <button @click="registerWithEmail" class="green" :disabled="loading">
            {{ loading ? "Creating account..." : "Create Account" }}
          </button>
          <button @click="showRegister = false" class="red">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      registerEmail: "",
      registerPassword: "",
      showRegister: false,
      loading: false,
      errorMessage: "",
    };
  },
  methods: {
    ...mapActions(["SIGN_IN_EMAIL", "SIGN_IN_GOOGLE", "SIGN_IN_ANONYMOUS", "REGISTER_EMAIL", "GET_INVOICES"]),
    async signInWithEmail() {
      if (!this.email || !this.password) {
        this.errorMessage = "Please fill in all fields";
        return;
      }
      this.loading = true;
      this.errorMessage = "";
      try {
        await this.SIGN_IN_EMAIL({ email: this.email, password: this.password });
        await this.GET_INVOICES();
        this.$router.push("/");
      } catch (error) {
        this.errorMessage = error.message || "Error signing in";
      } finally {
        this.loading = false;
      }
    },
    async signInWithGoogle() {
      this.loading = true;
      this.errorMessage = "";
      try {
        await this.SIGN_IN_GOOGLE();
        await this.GET_INVOICES();
        this.$router.push("/");
      } catch (error) {
        this.errorMessage = error.message || "Error signing in with Google";
      } finally {
        this.loading = false;
      }
    },
    async signInAnonymously() {
      this.loading = true;
      this.errorMessage = "";
      try {
        await this.SIGN_IN_ANONYMOUS();
        await this.GET_INVOICES();
        this.$router.push("/");
      } catch (error) {
        this.errorMessage = error.message || "Error signing in anonymously";
      } finally {
        this.loading = false;
      }
    },
    async registerWithEmail() {
      if (!this.registerEmail || !this.registerPassword) {
        this.errorMessage = "Please fill in all fields";
        return;
      }
      if (this.registerPassword.length < 6) {
        this.errorMessage = "Password must be at least 6 characters";
        return;
      }
      this.loading = true;
      this.errorMessage = "";
      try {
        await this.REGISTER_EMAIL({ email: this.registerEmail, password: this.registerPassword });
        await this.GET_INVOICES();
        this.$router.push("/");
      } catch (error) {
        this.errorMessage = error.message || "Error creating account";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="css" scoped>
.login-container {
  min-height: 100vh;
  background-color: #141625;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-card {
  background-color: #1e2139;
  border-radius: 20px;
  padding: 48px;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.branding {
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  gap: 16px;
}

.branding img {
  width: 30px;
  height: 40px;
}

.branding h1 {
  color: #fff;
  font-size: 24px;
}

.login-form h2 {
  color: #fff;
  margin-bottom: 24px;
  font-size: 20px;
}

.login-form h3 {
  color: #fff;
  margin-bottom: 16px;
  font-size: 16px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  color: #dfe3fa;
  font-size: 12px;
  margin-bottom: 8px;
}

.input-group input {
  width: 100%;
  background-color: #252945;
  color: #fff;
  border-radius: 4px;
  padding: 12px 16px;
  border: 1px solid #252945;
  font-size: 14px;
}

.input-group input:focus {
  outline: none;
  border-color: #7c5dfa;
}

.login-form button {
  width: 100%;
  margin-bottom: 12px;
  padding: 14px;
  font-size: 14px;
  font-weight: 600;
}

.login-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.divider {
  align-items: center;
  margin: 20px 0;
  gap: 12px;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background-color: #252945;
}

.divider span {
  color: #dfe3fa;
  font-size: 12px;
}

.error-message {
  background-color: rgba(236, 87, 87, 0.1);
  color: #ec5757;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 12px;
}

.register-link {
  margin-top: 20px;
  text-align: center;
}

.register-link p {
  color: #dfe3fa;
  font-size: 12px;
}

.register-link a {
  color: #7c5dfa;
  cursor: pointer;
  text-decoration: underline;
}

.register-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #252945;
}
</style>

