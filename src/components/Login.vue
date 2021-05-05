<template>
  <div id="container">

    <el-card>
      <el-form :model="loginForm" id="form-container" ref="loginForm">
        <el-header id="form-header">
          Login
        </el-header>

        <el-form-item id="email">
          <el-input v-model="loginForm.email" placeholder="Email" type="email"></el-input>
        </el-form-item>
        <el-form-item id="password">
          <el-input v-model="loginForm.password" placeholder="Password" type="password" show-password></el-input>
        </el-form-item>

        <el-footer id="login-button">
          <el-button type="primary" @click="login()" round>Login</el-button>
        </el-footer>

      </el-form>
    </el-card>

  </div>
</template>

<script>
import api from "../Api";
import {state} from "../state";

export default {
  name: "Login",

  data: function() {
    return {
      loginForm: {
        email: "",
        password: "",
      },
    }
  },

  methods: {
    login: function() {
      api.login(this.loginForm.email, this.loginForm.password)
          .then((res) => {
            state.userId = res.data.userId;
            state.token = res.data.token;
            api.setAuthHeader(state.token);
            this.$router.push("/events");

          })
          .catch((error) => {
            if (error.response.status === 400) {
              this.$message.error(error.response.statusText);
            }
          });
    }
  }


}
</script>

<style scoped>
  #container {
    min-width: 400px;
    max-width: 800px;
    padding: 1em;
    margin: auto;
  }

  #form-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, auto);
    grid-column-gap: 1em;
  }

  #form-header {
    grid-row: 1;
    grid-column: 1;

    text-align: center;
    font-size: 18px;
    margin: auto;
    padding: 1em;
  }

  #email {
    grid-row: 2;
    grid-column: 1;
    width: 50%;
    margin: 1em auto;
  }

  #password {
    grid-row: 3;
    grid-column: 1;
    width: 50%;
    margin: 1em auto;
  }

  #login-button {
    text-align: right;
  }

</style>