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

    <el-divider></el-divider>
    <div>
      <el-button type="primary" @click="openEditModal()">Edit Profile</el-button>
    </div>
  </el-card>

  <!-- Edit Modal -->
  <el-dialog
      width="500px"
      title="Edit Profile"
      v-model="editModal">
    <el-form id="edit-form" :model="editForm" ref="editForm" :rules="editRules">
      <el-form-item prop="email" style="grid-column: 1/3;">
        <el-input type="email" v-model="editForm.email" class="edit-input" placeholder="Email" ></el-input>
      </el-form-item>
      <el-form-item prop="firstName" style="grid-column: 1; grid-row: 2">
        <el-input v-model="editForm.firstName" class="edit-input" placeholder="First Name"></el-input>
      </el-form-item>
      <el-form-item prop="lastName" style="grid-column: 2; grid-row: 2">
        <el-input v-model="editForm.lastName" class="edit-input" placeholder="Last Name"></el-input>
      </el-form-item>
      <el-form-item prop="password" style="grid-column: 1; grid-row: 3">
        <el-input type="password" v-model="editForm.password" class="edit-input" placeholder="New Password"></el-input>
      </el-form-item>
      <el-form-item prop="currentPassword" style="grid-column: 2; grid-row: 3">
        <el-input type="password" v-model="editForm.currentPassword" :disabled="editForm.password === ''" class="edit-input" placeholder="Current Password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-upload
            :auto-upload="false"
            action="#"
            :on-change="userImageChanged"
            ref="imageUpload">
          <img v-if="editForm.image != null" width="100" height="100" :src="editForm.image"/>
          <el-button size="small" type="primary">select file</el-button>
        </el-upload>
      </el-form-item>
      <!-- Edit Image -->
      <el-button type="success" @click="updateUser()">Finish</el-button>
      <el-button type="danger" @click="editModal = false">Cancel</el-button>
      <el-button type="text" @click="resetEditForm()" style="grid-column: 1/3;">Reset</el-button>
    </el-form>
  </el-dialog>


</template>

<script>
import api from "../Api";

export default {
  name: "User",

  data: function() {
    let validatePasswordFields = (rule, value, callback) => {
      if (this.editForm.password !== "") {
        if (this.editForm.currentPassword === "") {
          callback(new Error("You must enter your current password."));
        }
        else {
          callback();
        }

      }
      else {
        callback();
      }
    };

    return {
      user: {},
      editModal: false,

      editForm: {
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        currentPassword: "",
        image: null,
        imageType: "",
      },
      editRules: {
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
          {min: 8, message: "Password must be at least 8 characters long.", trigger: 'blur'}
        ],
        currentPassword: [
          {validator: validatePasswordFields, trigger: "blur"}
        ],
      },
    }
  },

  methods: {
    getUser: function() {
      api.getUser(this.$route.params.id)
        .then((res) => {
          this.user = res.data;
          console.log(res.data);
        })
        .catch((error) => {
          this.$message.error("User does not exist.");
          console.log(error);
        });
    },

    getUserImage: function() {
      return api.getUserImage(this.$route.params.id);
    },

    userImageChanged: function(file) {
      this.editForm.image = URL.createObjectURL(file.raw);
      this.editForm.imageType = file.raw.type;
      console.log(this.editForm.image);
    },

    openEditModal: function() {
      this.editModal = true;
      this.editForm.email = this.user.email;
      this.editForm.firstName = this.user.firstName;
      this.editForm.lastName = this.user.lastName;
    },

    resetEditForm: function() {
      this.editForm.email = this.user.email;
      this.editForm.firstName = this.user.firstName;
      this.editForm.lastName = this.user.lastName;
      this.editForm.password = "";
      this.editForm.currentPassword = "";
    },

    updateUser: function() {
      this.$refs.editForm.validate((isValid) => {
          if(isValid) {
            let updatedDetails = {
              firstName: this.editForm.firstName,
              lastName: this.editForm.lastName,
              email: this.editForm.email,
            }
            if (this.editForm.password !== "") {
              updatedDetails.password = this.editForm.password
              updatedDetails.currentPassword = this.editForm.currentPassword;
            }

            // let file = this.$refs.imageUpload.uploadFiles[0].raw;
            // console.log(file);
            let headers = {
              "X-Authorization": sessionStorage.getItem("token"),
              "Content-Type": this.editForm.imageType,
            }

            api.setUserImage(this.$route.params.id, this.editForm.image, headers)
              .then(() => console.log("Success!"))
              .catch((error) => console.log(error));

            // api.updateUser(this.$route.params.id, updatedDetails)
            //   .then(() => {
            //     this.editModal = false;
            //     this.getUser();
            //     this.$message.success("Successfully updated user details.");
            //   })
            //   .catch((error) => {
            //     console.log(error);
            //     if (error.response.status) {
            //       this.$message.error(error.response.statusText);
            //     }
            //   });
          }
      });
    },

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

  /* === EDIT FORM === */
  #edit-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 1em;
    grid-row-gap: 0.5em;
  }

  .edit-input {
  }


</style>