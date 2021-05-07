<template>
  <el-card class="container">
    <el-header>
      <el-input placeholder="Search for events" v-model="searchQuery">
        <template #append>
          <el-button icon="el-icon-search"></el-button>
        </template>
      </el-input>
    </el-header>

    <el-divider></el-divider>

    <el-container>

      <el-card class="event-card">
        <img src="../assets/logo.png"/>
        <div class="info-container">
          <div class="date">
            10-10-2021 19:00:00
          </div>
          <div class="event-title">
            Event Title
          </div>
          <div class="tags">
           <el-tag class="tag">Film</el-tag>
           <el-tag class="tag">Entertainment</el-tag>
          </div>

          <el-divider>10/100 Capacity</el-divider>
          <div class="host-container">
            <el-avatar></el-avatar>
            <div class="host-name">
              FirstName LastName
            </div>
          </div>

        </div>
      </el-card>


    </el-container>

  </el-card>
</template>

<script>

export default {
  name: "EventSearch",

  data: function() {
    return {
      searchQuery: "",
    }
  },

  mounted: function() {
    if (sessionStorage.token === "") {
      this.$message.error("You must log in first.");
      this.$router.push("/");
    }

    console.log(sessionStorage.getItem("userId"));
    sessionStorage.setItem("test", "test");

  }

}
</script>

<style scoped>

  .info-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(auto-fit, auto);
  }

  .event-card {
    width: 33%;
    margin: 0.5em 0.5em;
  }

  .tag {
    margin: 0.5em;
  }

  .host-container {
    display: inline-flex;
    margin: auto;
  }

  .host-name {
    margin: auto auto auto 0.5em;
  }

</style>