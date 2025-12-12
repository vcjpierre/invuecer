<template>
  <div class="login-container flex flex-column">
    <div class="login-card">
      <div class="branding flex">
        <img src="@/assets/file-invoice-dollar-solid.png" alt="" />
        <h1>Invoice App</h1>
      </div>
      <div class="login-form flex flex-column">
        <h2>Iniciar Sesión</h2>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <div class="input-group flex flex-column">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="tu@email.com"
            required
          />
        </div>
        <div class="input-group flex flex-column">
          <label for="password">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="••••••••"
            required
          />
        </div>
        <button @click="signInWithEmail" class="purple" :disabled="loading">
          {{ loading ? "Cargando..." : "Iniciar Sesión con Email" }}
        </button>
        <div class="divider flex">
          <span>o</span>
        </div>
        <button @click="signInWithGoogle" class="dark-purple" :disabled="loading">
          Iniciar Sesión con Google
        </button>
        <button @click="signInAnonymously" class="orange" :disabled="loading">
          Continuar como Anónimo
        </button>
        <div class="register-link">
          <p>¿No tienes cuenta? <a @click="showRegister = true">Regístrate aquí</a></p>
        </div>
        <div v-if="showRegister" class="register-section flex flex-column">
          <h3>Crear Cuenta</h3>
          <div class="input-group flex flex-column">
            <label for="registerEmail">Email</label>
            <input
              type="email"
              id="registerEmail"
              v-model="registerEmail"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div class="input-group flex flex-column">
            <label for="registerPassword">Contraseña</label>
            <input
              type="password"
              id="registerPassword"
              v-model="registerPassword"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
          <button @click="registerWithEmail" class="green" :disabled="loading">
            {{ loading ? "Creando cuenta..." : "Crear Cuenta" }}
          </button>
          <button @click="showRegister = false" class="red">Cancelar</button>
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
        this.errorMessage = "Por favor completa todos los campos";
        return;
      }
      this.loading = true;
      this.errorMessage = "";
      try {
        await this.SIGN_IN_EMAIL({ email: this.email, password: this.password });
        await this.GET_INVOICES();
        this.$router.push("/");
      } catch (error) {
        this.errorMessage = error.message || "Error al iniciar sesión";
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
        this.errorMessage = error.message || "Error al iniciar sesión con Google";
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
        this.errorMessage = error.message || "Error al iniciar sesión anónima";
      } finally {
        this.loading = false;
      }
    },
    async registerWithEmail() {
      if (!this.registerEmail || !this.registerPassword) {
        this.errorMessage = "Por favor completa todos los campos";
        return;
      }
      if (this.registerPassword.length < 6) {
        this.errorMessage = "La contraseña debe tener al menos 6 caracteres";
        return;
      }
      this.loading = true;
      this.errorMessage = "";
      try {
        await this.REGISTER_EMAIL({ email: this.registerEmail, password: this.registerPassword });
        await this.GET_INVOICES();
        this.$router.push("/");
      } catch (error) {
        this.errorMessage = error.message || "Error al crear la cuenta";
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

