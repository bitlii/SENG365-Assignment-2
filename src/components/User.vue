<template>
  <el-card class="container">
    <div id="image-container">
      <el-avatar icon="el-icon-user-solid" :size="250" shape="square"></el-avatar>
    </div>
    <el-divider></el-divider>
    <div>
      <div class="detail-container">
        FirstName LastName
      </div>
      <div class="detail-container">
        someemail@email.com
      </div>
    </div>


  </el-card>
</template>

<script>
export default {
  name: "User"
}
</script>

<style scoped>
  #image-container {
    text-align: center;

  }

  .detail-container {
    padding: 0.5em;
  }

</style>