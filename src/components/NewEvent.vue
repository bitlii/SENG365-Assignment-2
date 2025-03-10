<template>
  <el-card class="container">
    <el-header> Create a new event </el-header>

    <el-form :model="eventForm" :rules="eventFormRules" ref="eventForm">

      <!-- Required Fields -->
      <el-form-item prop="title">
        <el-input  v-model="eventForm.title" placeholder="Event title"></el-input>
      </el-form-item>
      <el-form-item prop="description">
        <el-input v-model="eventForm.description" type="textarea" :rows="3" resize="none" placeholder="Description"></el-input>
      </el-form-item>
      <el-form-item prop="categories">
        <el-select class="input-control category-select" v-model="eventForm.categoryIds" placeholder="Categories" multiple filterable>
          <el-option v-for="cat in eventCategories" :key="cat.id" :label="cat.name" :value="cat.id"></el-option>
        </el-select>
      </el-form-item>

      <div id="online-event-row">
        <el-form-item style="display: inline-flex; justify-content: flex-end;">
          <span v-if="eventForm.isOnline" style="padding-right: 4px;"> Online </span>
          <span v-else style="padding-right: 4px;"> In-Person </span>
          <el-switch v-model="eventForm.isOnline"></el-switch>
        </el-form-item>
        <el-form-item prop="url">
          <el-input v-model="eventForm.url" placeholder="URL"></el-input>
        </el-form-item>
        <el-form-item prop="venue">
          <el-input v-model="eventForm.venue" :disabled="eventForm.isOnline" placeholder="Venue"></el-input>
        </el-form-item>
      </div>

      <!-- Optional Fields -->
      <div id="fee-date-row">
        <el-form-item>
<!--          <el-tooltip content="Leave blank for to set event as free." placement="top">-->
            <el-input v-model="eventForm.fee" type="number" placeholder="Fee (Empty field will create an empty event)">
              <template #prepend> $ </template>
            </el-input>
<!--          </el-tooltip>-->
        </el-form-item>
        <el-form-item prop="date">
          <el-date-picker v-model="eventForm.date" style="width: 100%" type="datetime" placeholder="Select Date & Time" :disabled-date="disablePastDates"></el-date-picker>
        </el-form-item>
      </div>

      <div id="capacity-control-row">
        <el-form-item prop="capacity">
          <el-input type="number" v-model="eventForm.capacity" placeholder="Capacity (Empty field will set no limit)"></el-input>
        </el-form-item>
        <el-form-item>
          Require Attendance Control
          <el-switch v-model="eventForm.requireAttendanceControl"></el-switch>
        </el-form-item>
      </div>

      <el-form-item id="image-uploader">
        <div>Add Event Image (Optional)</div>
        <el-upload
            :auto-upload="false"
            action="#"
            list-type="picture-card"
            :on-change="toggleImage"
            :show-file-list="false">
          <el-image v-if="eventForm.imageView" :src="eventForm.imageView" class="image" fit="contain"/>
          <i v-else class="el-icon-plus image-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <div id="remove-button">
        <el-button type="text" @click="removeImage()">Remove</el-button>
      </div>


      <el-button type="primary" @click="createEvent('eventForm')"> Create </el-button>

    </el-form>

  </el-card>
</template>

<script>
import api from "../Api";

export default {
  name: "NewEvent",

  data: function() {
    let validateUrl = (rule, value, callback) => {
      if (this.eventForm.isOnline) {
        if (this.eventForm.url === "") {
          callback(new Error("A URL is required for an online event."));
        }
        else {
          callback();
        }
      }
      else {
        callback();
      }
    };
    let validateVenue = (rule, value, callback) => {
      if (!this.eventForm.isOnline) {
        if (this.eventForm.venue === "") {
          callback(new Error("A venue is required for an offline event."));
        }
        else {
          callback();
        }
      }
      else {
        callback();
      }
    };

    let validateCategories = (rule, value, callback) => {
      if (this.eventForm.categoryIds.length < 1) {
          callback(new Error("At least one category is required."));
      }
      else {
        callback();
      }
    };

    let validateCapacity = (rule, value, callback) => {
      if (this.eventForm.capacity < 0) {
        callback(new Error("Capacity cannot be below 0."));
      }
      else {
        callback();
      }
    };

    return {
      eventForm: {
        title: "",
        description: "",
        capacity: null,
        categoryIds: [],
        date: "",
        url: "",
        venue: "",
        isOnline: false,
        requireAttendanceControl: false,
        fee: null,

        imageView: null,
        image: null,
      },
      eventCategories: [],

      eventFormRules: {
        title: [
          {required: true, message: "Event title is missing.", trigger: "blur"},
        ],
        description: [
          {required: true, message: "Event description is missing.", trigger: "blur"},
        ],
        categories: [
          {validator: validateCategories, trigger: "blur"},
        ],
        url: [
          {validator: validateUrl, trigger: "blur"}
        ],
        venue: [
          {validator: validateVenue, trigger: "blur"}
        ],
        capacity: [
          {validator: validateCapacity, trigger: "blur"}
        ],
        date: [
          {required: true, message: "Date for this event is missing.", trigger: "blur"},
          {type: "date", message: "Please input a valid date.", trigger: "change"}
        ],
      },
    }
  },

  methods: {
    getAllCategories: function() {
      api.getEventCategories()
          .then((res) => {
            this.eventCategories = res.data;
            console.log("retrieved event categories.");
          })
          .catch((error) => {
            console.log("internal server error getting event categories: " + error);
          });
    },

    disablePastDates: function(date) {
      return date < Date.now();
    },

    toggleImage: function(file) {
      if (this.checkValidProfileImage(file)) {
        this.eventForm.imageView = URL.createObjectURL(file.raw);
        this.eventForm.image = file.raw;
      }
    },

    checkValidProfileImage: function(file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      let isValid = true;

      if (!validImageTypes.includes(file.raw.type)) {
        isValid = false;
        this.$message.error("Profile image must be a JPG, PNG, or GIF.")
      }
      return isValid;
    },

    removeImage: function() {
      this.eventForm.imageView = null;
      this.eventForm.image = null;

    },

    createEvent: function(eventForm) {
      this.$refs[eventForm].validate((isValid) => {
        if (isValid) {
          this.eventForm.capacity = this.eventForm.capacity == null ? null : parseInt(this.eventForm.capacity);
          this.eventForm.fee = this.eventForm.fee == null ? null : parseFloat(this.eventForm.fee);
          this.eventForm.date = this.eventForm.date.toISOString();
          this.eventForm.date = this.eventForm.date.replace("T", " ");
          this.eventForm.date = this.eventForm.date.replace("Z", "");
          let newEvent = {
            title: this.eventForm.title,
            description: this.eventForm.description,
            categoryIds: this.eventForm.categoryIds,
            date: this.eventForm.date,
            isOnline: this.eventForm.isOnline,
            url: this.eventForm.url,
            requiresAttendanceControl: this.eventForm.requireAttendanceControl,
          }
          if (!this.eventForm.isOnline) {
            newEvent.venue = this.eventForm.venue;
          }


          if (this.eventForm.capacity != null || this.eventForm.capacity === 0) {
             newEvent.capacity = this.eventForm.capacity;
          }

          if (this.eventForm.fee != null) {
            newEvent.fee = this.eventForm.fee;
          }

          console.log(newEvent);
          api.createEvent(newEvent)
            .then((res) => {
              if (this.eventForm.image != null) {
                let headers = {
                  'X-Authorization': sessionStorage.getItem("token"),
                  'Content-Type': this.eventForm.image.type,
                };

                api.setEventImage(res.data.eventId, this.eventForm.image, headers)
                  .then(() => {
                    this.$router.push(`/events/${res.data.eventId}`);
                  })
                  .catch((error) => {
                    this.$message.error(error.response.statusText);
                    console.log(error);
                  });

              }
              else {
                this.$router.push(`/events/${res.data.eventId}`);
              }
            })
            .catch((error) => {
              console.log(error);
              if (error.response.status === 400) {
                this.$message.error("Could not create event: " + error.response.statusText);
              }
              if (error.response.status === 401) {
                this.$message.error("You must be logged in to create an event.");
              }

            })
        }
        else {
          return false;
        }
      });

    },

  },


  mounted: function() {
    if (sessionStorage.getItem("token") == null) {
      this.$message.error("You must log in first.");
      this.$router.push("/");
    }

    this.getAllCategories();
  }

}
</script>

<style scoped>
  .container {
    max-width: 800px;
  }

  .category-select {
    width: 100%;
  }

  #online-event-row {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 0.5fr 1fr 1fr;
    grid-column-gap: 1em;
  }

  #fee-date-row {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 1em;
  }

  #capacity-control-row {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 1em;
  }

  #image-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-bottom: 0;
  }

  #image-uploader:hover {
    border-color: #409eff;
  }

  #image-uploader >>> .el-upload {
    border: none;
    width: 100%;
  }

  .image {
    width: 100%;
    height: 100%;
  }

  #remove-button {
    padding-bottom: 1em;
    margin-bottom: 1em;
  }

</style>