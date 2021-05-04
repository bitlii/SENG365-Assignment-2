<template>
  <el-container>
    <el-header>
      <el-menu class="el-menu-demo" theme="dark" mode="horizontal" :default-active="activeNavIndex" :router="true">
        <el-menu-item index="1" :route="'/'">Login</el-menu-item>
        <el-menu-item index="2" :route="'/register'">Register</el-menu-item>
      </el-menu>
    </el-header>

    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "App",

  data: function() {
    return {
      activeNavIndex: "1",
    }
  }

}

</script>

<style scoped>

</style>