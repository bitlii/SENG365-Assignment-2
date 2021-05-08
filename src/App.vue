<template>
  <el-container>
    <el-header v-if="$route.path === '/' || $route.path === '/register'">
      <el-menu
          class="nav-menu"
          mode="horizontal"
          :default-active="activeNavIndex"
          :router="true"
          text-color="#FFFFFF"
          active-text-color="#FFFFFF"
          background-color="#303443">
        <el-menu-item index="1" :route="'/'">Login</el-menu-item>
        <el-menu-item index="2" :route="'/register'">Register</el-menu-item>
      </el-menu>
    </el-header>
    <el-header v-else>
      <el-menu class="nav-menu"  mode="horizontal" :default-active="activeNavIndex" :router="true"
               text-color="#FFFFFF"
               active-text-color="#FFFFFF"
               background-color="#303443">
        <el-menu-item @click="logout()">Logout</el-menu-item>
        <el-menu-item index="1" :route="'/events'">Events</el-menu-item>
        <el-menu-item index="2" :route="`/users/${getLoggedInUserId()}`">Profile</el-menu-item>
      </el-menu>
    </el-header>

    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import api from "./Api";

export default {
  name: "App",

  data: function() {
    return {
      isLoggedIn: false,
      activeNavIndex: "1",

      avatarImage: null,
    }
  },

  methods: {
    logout: function() {
      api.logout()
        .then(() => {
          sessionStorage.removeItem("userId")
          sessionStorage.removeItem("token")

          this.activeNavIndex = "1";
          this.$router.push("/");
        })
        .catch((error) => {
          if (error.response.status === 401) {
            this.$message.error("You must be logged in to logout.");
          }
          console.log(error.response);
        });

    },

    getLoggedInUserId: function() {
      return sessionStorage.getItem("userId");
    },

    // setAvatarImage: function() {
    //   if (sessionStorage.getItem("userId") != null) {
    //     api.getUserImage(sessionStorage.getItem("userId"))
    //         .then((res) => {
    //           this.avatarImage = res.data;
    //           console.log(this.avatarImage);
    //         });
    //     return true;
    //   }
    //   return false;
    // },
  },

}

</script>

<style scoped>
.nav-menu {
  background: #2C2C2D;
}

</style>