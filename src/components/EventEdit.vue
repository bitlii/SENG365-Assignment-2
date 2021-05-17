<template>
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
        <el-tooltip content="Leave blank for to set event as free." placement="top">
          <el-input v-model="eventForm.fee" type="number" placeholder="Fee (Empty field will create an empty event)">
            <template #prepend> $ </template>
          </el-input>
        </el-tooltip>

      </el-form-item>
      <el-form-item prop="date">
        <el-date-picker v-model="eventForm.date" style="width: 100%" type="datetime" placeholder="Select Date & Time" :disabled-date="disablePastDates"></el-date-picker>
      </el-form-item>
    </div>

    <div id="capacity-control-row">
      <el-form-item>
        <el-input type="number" v-model="eventForm.capacity" placeholder="Capacity (Empty field will set no limit)"></el-input>
      </el-form-item>
      <el-form-item>
        Require Attendance Control
        <el-switch v-model="eventForm.requireAttendanceControl"></el-switch>
      </el-form-item>
    </div>

    <el-upload
        class="image-uploader"
        action="#"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="toggleImage">
      <img v-if="eventForm.image" :src="eventForm.image" class="image" />
      <i v-else class="el-icon-plus image-uploader-icon"></i>
    </el-upload>


    <el-button type="primary" @click="editEvent('eventForm')"> Edit </el-button>

  </el-form>
</template>

<script>
import api from "../Api";

export default {
  name: "EventEdit",
  props: {
    eventData: Object,
    eventCategories: Array,
  },
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
      } else {
        callback();
      }
    };

    return {
      eventForm: {
        title: this.eventData.title,
        description: this.eventData.description,
        capacity: this.eventData.capacity.toString(),
        categoryIds: this.eventData.categories,
        date: this.eventData.date,
        url: this.eventData.url,
        venue: this.eventData.venue,
        isOnline: this.eventData.isOnline,
        requireAttendanceControl: this.eventData.requireAttendanceControl,
        fee: this.eventData.fee.toString(),

        image: null,
        imageRaw: null,
      },

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
        date: [
          {required: true, message: "Date for this event is missing.", trigger: "blur"},
          {type: "date", message: "Please input a valid date.", trigger: "change"}
        ],
      },
    }
  },

  methods: {
    disablePastDates: function(date) {
      return date < Date.now();
    },

    toggleImage: function(file) {
      console.log(file);
      this.eventForm.image = URL.createObjectURL(file.raw);
      this.eventForm.imageRaw = file.raw;
    },

    editEvent: function(eventForm) {
      this.$refs[eventForm].validate((isValid) => {
        if (isValid) {
          this.eventForm.capacity = this.eventForm.capacity == null ? null : parseInt(this.eventForm.capacity);
          this.eventForm.fee = this.eventForm.fee == null ? null : parseFloat(this.eventForm.fee);
          this.eventForm.date = this.eventForm.date.replace("T", " ");
          this.eventForm.date = this.eventForm.date.replace("Z", "");

          let editedEvent = {
            title: this.eventForm.title,
            description: this.eventForm.description,
            categoryIds: this.eventForm.categoryIds,
            date: this.eventForm.date,
            isOnline: this.eventForm.isOnline,
            url: this.eventForm.url,
            requiresAttendanceControl: this.eventForm.requireAttendanceControl,
          }

          if (!this.eventForm.isOnline) {
            editedEvent.venue = this.eventForm.venue;
          }

          if (this.eventForm.capacity != null) {
            editedEvent.capacity = this.eventForm.capacity;
          }

          if (this.eventForm.fee != null) {
            editedEvent.fee = this.eventForm.fee;
          }

          api.editEvent(this.eventData.id, editedEvent)
              .then(() => {
                if (this.eventForm.image != null) {
                  let headers = {
                    'X-Authorization': sessionStorage.getItem("token"),
                    'Content-Type': this.eventForm.imageRaw.type,
                  };
                  api.setEventImage(this.eventData.id, this.eventForm.imageRaw, headers)
                      .then(() => {
                        console.log("Successfully edited image.");
                      })
                      .catch((error) => {
                        this.$message.error(error.response.statusText);
                        console.log(error);
                      });
                }
                this.$emit("editFinish");
              })
              .catch((error) => {
                console.log(error);
                if (error.response) {
                  this.$message.error(error.response.statusText);
                }

              });
        }
        else {
          return false;
        }
      });
    }
  },

  mounted: function() {
    if (sessionStorage.getItem("token") == null) {
      this.$message.error("You must log in first.");
      this.$router.push("/");
    }
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

.image-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.image-uploader .el-upload:hover {
  border-color: #409eff;
}
.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.image {
  width: 178px;
  height: 178px;
  display: block;
}

</style>