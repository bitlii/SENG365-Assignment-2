<template>
  <el-card class="container">

    <div id="image-container">
      <el-avatar :src="getUserImage()" :size="200" shape="square">
        <template #error>
          <el-avatar icon="el-icon-user-solid" :size="200" shape="square"></el-avatar>
        </template>
      </el-avatar>
    </div>

    <el-divider></el-divider>

    <div>
      <div class="detail-container">
        {{ user.firstName }} {{ user.lastName }}
      </div>
      <div class="detail-container">
        {{ user.email }}
      </div>
    </div>


  </el-card>
</template>

<script>
import api from "../Api";

export default {
  name: "User",

  data: function() {
    return {
     user: {},
    }
  },

  methods: {
    getUser: function() {
      console.log(this.$route.params.id);
      api.getUser(this.$route.params.id)
        .then((res) => {
          this.user = res.data;
        })
        .catch((error) => {
          this.$message.error("User does not exist.");
          console.log(error);
        });
    },

    getUserImage: function() {
      return api.getUserImage(this.$route.params.id);
    }
  },

  mounted: function() {
    if (sessionStorage.getItem("token") == null) {
      this.$message.error("You must log in first.");
      this.$router.push("/");
    }

    if (sessionStorage.getItem("userId") !== this.$route.params.id) {
      this.$message.error("You do not have permission to access this user's page.");
      let userId = sessionStorage.getItem("userId");
      this.$router.push(`/users/${userId}`);
    }

    this.getUser();
  }

}
</script>

<style scoped>
  .container {
    width: 500px;
  }

  #image-container {
    text-align: center;

  }

  .detail-container {
    padding: 0.5em;
  }

</style>