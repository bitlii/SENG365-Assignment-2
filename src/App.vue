<template>
  <el-container>
    <el-header v-if="!checkAuth()">
      <el-menu mode="horizontal" :default-active="activeNavIndex" :router="true">
        <el-menu-item index="1" :route="'/'">Login</el-menu-item>
        <el-menu-item index="2" :route="'/register'">Register</el-menu-item>
      </el-menu>
    </el-header>
    <el-header v-else>
      <el-menu mode="horizontal" :default-active="activeNavIndex" :router="true">
        <el-menu-item @click="logout()">Logout</el-menu-item>
        <el-menu-item index="1" :route="'/events'">Events</el-menu-item>
        <el-menu-item index="2" :route="'/user'">Profile</el-menu-item>
        <el-menu-item v-if="setAvatarImage()">
          <el-avatar id="avatar" :src="avatarImage"></el-avatar>
        </el-menu-item>

      </el-menu>
    </el-header>

    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import {state} from "./state";
import api from "./Api";

export default {
  name: "App",

  data: function() {
    return {
      activeNavIndex: "1",

      avatarImage: null,
    }
  },

  methods: {
    logout: function() {
      api.logout()
        .then(() => {
          state.resetState();
          this.activeNavIndex = "1";
          this.$router.push("/");
        })
        .catch((error) => {
          if (error.response.status === 401) {
            this.$message.error("You must be logged in to logout.");
          }
          console.log(error);
        });

    },

    checkAuth: function() {
      return state.token !== "";
    },

    setAvatarImage: function() {
      console.log(state.token);
      if (this.checkAuth()) {
        api.getUserImage(state.userId)
            .then((res) => {
              this.avatarImage = res.data;
              console.log(this.avatarImage);
            });
        return true;
      }
      return false;
    },
  },

}

</script>

<style scoped>

</style>