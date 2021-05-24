<template>
   <el-card class="container">
      <el-form :model="registerForm" id="form-container" ref="registerForm" :rules="formRules">
        <el-header id="form-header">
          Create a new account
        </el-header>

        <el-form-item id="image-uploader">
            <div>Add Profile Image (Optional)</div>
          <el-upload
              class="image-upload"
              :auto-upload="false"
              action="#"
              list-type="picture-card"
              :on-change="toggleUpload"
              :show-file-list="false">
            <el-image v-if="registerForm.profileImage != null" :src="registerForm.profileImageView"/>
            <div v-else class="el-icon-plus avatar-uploader-icon"></div>
          </el-upload>
          <el-button type="text" @click="removeImage()">Remove</el-button>
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
          <el-input v-model="registerForm.password" @keyup.enter="onRegister('registerForm')" placeholder="New Password" type="password" show-password></el-input>
        </el-form-item>

        <el-form-item id="create-button">
          <el-button type="primary" @click="onRegister('registerForm')" >Create</el-button>
        </el-form-item>

      </el-form>
    </el-card>
</template>

<script>
import api from "../Api";

export default {
  name: "Register",
  emits: ["logged-in"],

  data: function() {
    return {
      registerForm: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        profileImage: null,
        profileImageView: null,
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
    toggleUpload(file) {
      if (this.checkValidProfileImage(file)) {
        this.registerForm.profileImageView = URL.createObjectURL(file.raw);
        this.registerForm.profileImage = file.raw;
      }
    },

    checkValidProfileImage: function(file) {
      console.log(file);
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      let isValid = true;

      if (!validImageTypes.includes(file.raw.type)) {
        isValid = false;
        this.$message.error("Profile image must be a JPG, PNG, or GIF.")
      }

      return isValid;
    },

    removeImage: function() {
      this.registerForm.profileImageView = null;
      this.registerForm.profileImage = null;
    },

    onRegister: function(form) {
      this.$refs[form].validate((isValid) => {
        if (isValid) {
          console.log(this.registerForm);
          api.register(this.registerForm.firstName, this.registerForm.lastName, this.registerForm.email, this.registerForm.password)
              .then(() => {
                console.log("registered.");
                api.login(this.registerForm.email, this.registerForm.password)
                  .then((res) => {
                    console.log("logged in.");
                    sessionStorage.setItem('userId', res.data.userId);
                    sessionStorage.setItem('token', res.data.token);
                    this.$emit("logged-in");
                    if (this.registerForm.profileImage != null) {
                      let headers = {
                        'X-Authorization': sessionStorage.getItem("token"),
                        'Content-Type': this.registerForm.profileImage.type,
                      };
                      api.setUserImage(res.data.userId, this.registerForm.profileImage, headers)
                        .then(() => {
                          this.$router.push("/events");
                        })
                        .catch((error) => {
                          this.$message.error("Something went wrong setting image: " + error.response.status);
                        });
                    }
                    else {
                      this.$router.push("/events");
                    }
                  })
                  .catch((error) => {
                    if (error.response.status === 400) {
                      this.$message.error("Something went wrong logging you in.");
                    }
                    console.log(error);
                  });
              })
              .catch((error) => {
                if (error.response.status === 400) {
                  this.$message.error(error.response.statusText);
                }
                console.log(error);
              });
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
  .container {
    min-width: 400px;
    max-width: 800px;
    padding: 1em;
    margin: auto;
  }

  #form-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: repeat(4, auto);
    grid-column-gap: 1em;
  }

  #form-header {
    grid-row: 1;
    grid-column: 1/4;

    text-align: center;
    margin: auto;
    font-size: 18px;
  }

  #image-uploader {
    grid-row: 2/4;
    grid-column: 1;

    text-align: center;
    overflow: hidden;
    margin: auto
  }

  #first-name {
    grid-row: 2;
    grid-column: 2;
    margin: auto 0;
  }

  #last-name {
    grid-row: 2;
    grid-column: 3;
    margin: auto 0;
  }

  #email {
    grid-row: 3;
    grid-column: 2;
    margin: auto 0;
  }

  #password {
    grid-row: 3;
    grid-column: 3;
    margin: auto 0;
  }

  #create-button {
    grid-column: 3;
    text-align: center;
  }

  /* Image Upload Styling */

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    margin: auto;
    text-align: center;
  }


  @media screen and (max-width: 560px) {
  }

</style>