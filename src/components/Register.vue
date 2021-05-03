<template>
   <el-card class="container">
      <el-form :model="registerForm" id="form-container" ref="registerForm" :rules="formRules">

        <el-header id="form-header">
          Create a new account
        </el-header>

        <el-form-item id="image-uploader">
          <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :on-success="onProfileImageSelected"
              :before-upload="checkValidProfileImage" >
            <img v-if="registerForm.profileImage" :src="registerForm.profileImage" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div>Add Profile Image (Optional)</div>
          </el-upload>
        </el-form-item>

        <el-form-item id="first-name" prop="firstName">
          <el-input v-model="registerForm.firstName" placeholder="First Name"></el-input>
        </el-form-item>

        <el-form-item id="last-name" prop="lastName">
          <el-input v-model="registerForm.lastName" placeholder="Last Name"></el-input>
        </el-form-item>

        <el-form-item id="email" prop="email">
          <el-input v-model="registerForm.email" placeholder="Email" type="email"></el-input>
        </el-form-item>
        <el-form-item id="password" prop="password">
          <el-input v-model="registerForm.password" placeholder="Password" type="password" show-password></el-input>
        </el-form-item>

        <el-form-item id="create-button">
          <el-button type="primary" @click="onRegister('registerForm')" round>Create</el-button>
        </el-form-item>

      </el-form>
    </el-card>
</template>

<script>
export default {
  name: "Register",

  data: function() {
    return {
      registerForm: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        profileImage: null,
      },
      formRules: {
        firstName: [
          {required: true, message: "First name is required.", trigger: 'change'}
        ],
        lastName: [
          {required: true, message: "Last name is required.", trigger: 'change'}
        ],
        email: [
          {required: true, message: "Email is required.", trigger: 'change'},
          {type: 'email', message: "Please input a valid email.", trigger: 'blur'}
        ],
        password: [
          {required: true, message: "Password is required.", trigger: 'change'},
          {min: 8, message: "Password must be at least 8 characters long.", trigger: 'change'}
        ],
      }
    }
  },

  methods: {
    onProfileImageSelected: function(res, file) {
      console.log("Image uploaded.");
      this.profileImage = file;
    },

    checkValidProfileImage: function(file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      let isValid = true;

      if (!validImageTypes.includes(file.type)) {
        isValid = false;
        this.$message.error("Profile image must be a JPG, PNG, or GIF.")
      }

      return isValid;
    },

    onRegister: function(form) {
      this.$refs[form].validate((isValid) => {
        if (isValid) {
          alert("it works");
        }
        else {
          return false;
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
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(4, auto);
    grid-column-gap: 1em;
  }

  #form-header {
    grid-row: 1;
    grid-column: 1/3;

    text-align: center;
  }

  #image-uploader {
    grid-row: 2/4;
    grid-column: 1;

    text-align: center;
  }

  #first-name {
    grid-row: 2;
    grid-column: 2;
  }

  #last-name {
    grid-row: 3;
    grid-column: 2;
  }

  #create-button {
    grid-column: 2;
    text-align: right;
  }

  /* Image Upload Styling */
  .avatar-uploader {
    padding: 1em;

    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
  }

  .avatar-uploader:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    margin: auto;
    text-align: center;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }

  @media screen and (max-width: 560px) {
    .avatar-uploader {
      line-height: 24px;
    }
  }

</style>