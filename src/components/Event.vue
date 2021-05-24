<template>
  <el-container direction="vertical">
    <el-card class="container" v-if="event != null">

      <div id="header">
        <!-- Left Hand Title + Fee Section -->
        <div id="title">
          {{ event.title }}
          <div id="fee" class="secondary-text">
            <div v-if="event.fee === '0.00'">
              <i class="el-icon-money"></i> Free Event
            </div>
            <div v-else>
              <i class="el-icon-money"></i> Fee: ${{ event.fee }}
            </div>
          </div>
        </div>
        <!-- Right Hand Attendees Section -->
        <div>
          <div class="attendees" v-if="event.capacity != null">
            {{ event.attendeeCount }}/{{ event.capacity }} Attendees <i class="el-icon-user-solid"></i>
          </div>
          <div class="attendees" v-else>
            {{ event.attendeeCount }} Attendees <i class="el-icon-user-solid"></i>
          </div>
          <div id="organizer-header">
            <div id="organizer-container">
              <div style="font-size: 12px;" class="secondary-text">
                Organizer:
              </div>
              <div id="host">
                {{ event.organizerFirstName }} {{ event.organizerLastName }}
              </div>
            </div>
            <el-avatar :src="getHostImage(event.organizerId)">
              <template #error>
                <el-avatar icon="el-icon-user-solid"></el-avatar>
              </template>
            </el-avatar>
          </div>
        </div>
      </div>

      <el-divider></el-divider>

      <div id="image-container">
        <el-image id="event-image" :src="eventImage">
          <template #error>
            <el-image class="event-image" :src="'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'" fit="cover"/>
          </template>
        </el-image>
      </div>

      <div id="info-container">
        <div id="tags">
          <el-tag class="tag" size="large" v-for="cat in getEventCategories(event.categories)" :key="cat">
            {{ cat.name }}
          </el-tag>
        </div>

        <div id="date">
          <i class="el-icon-date"></i>
          {{ event.date }}
        </div>

        <div class="location" v-if="!event.isOnline">
          <i class="el-icon-location"></i>
          {{ event.venue }}
        </div>
        <div class="location" v-if="event.url != null">
          <i class="el-icon-link"></i>
          <a :href="event.url">{{ event.url }}</a>
        </div>
      </div>

      <el-divider></el-divider>

      <!-- ACTIONS SECTION -->
      <div v-if="!isOrganizer()">
        <el-button type="primary" :disabled="!checkAttendanceEligibility()" @click="requestAttendance()">
          {{ attendanceButtonText }}</el-button>
        <el-button type="danger" v-if="checkCanLeave()" @click="leaveEvent()">
          Leave</el-button>
      </div>
      <div v-else-if="isFutureDate()" style="display:flex; justify-content: space-around">
        <el-button type="danger" @click="deleteDialogVisible = true">Delete</el-button>
        <el-dialog  width="400px" title="Confirm Deletion" v-model="deleteDialogVisible">
          Are you sure you want to delete this event?
          <template #footer>
            <el-button @click="deleteDialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="deleteEvent()">Confirm</el-button>
          </template>
        </el-dialog>

        <el-button type="primary" @click="editModal = true">Edit Event</el-button>
        <el-dialog v-model="editModal" title="Edit Event">
          <EventEdit :eventData="event" :eventCategories="allCategories" :eventImage="eventImage" @editFinish="editFinish"></EventEdit>
        </el-dialog>

        <el-button type="primary" @click="attendanceDrawerVisible = true">Manage Attendance</el-button>
        <el-drawer v-model="attendanceDrawerVisible" title="Manage Attendee Requests" size="40%">
          <el-table :data="requestedAttendees" id="request-attendees-table">
            <el-table-column prop="firstName" label="First Name"></el-table-column>
            <el-table-column  prop="lastName" label="Last Name"></el-table-column>
            <el-table-column width="150px" label="Action" fixed="right">
              <template #default="props">
                <el-button-group style="display: inline-flex;">
                  <el-button type="success" size="small" @click="changeAttendeeStatus(props.row, 'accepted')">Accept</el-button>
                  <el-button type="danger" size="small" @click="changeAttendeeStatus(props.row, 'rejected')">Reject</el-button>
                </el-button-group></template>

            </el-table-column>
          </el-table>

        </el-drawer>
      </div>

      <el-divider></el-divider>

      <div id="description">
        {{ event.description }}
      </div>
    </el-card>

    <el-card class="container sub-container">
      <el-header> Similar Events </el-header>
      <el-scrollbar>
        <div style="display: flex; flex-direction: row; width:fit-content">
          <el-card class="event-card"
                   v-for="event in similarEvents"
                   :key="event.eventId"
                   :body-style="{ padding: '0px', height: '100%'}"
                   shadow="hover"
                   @click="goToEvent(event.eventId)">
            <el-image class="event-image" :src="getEventImage(event.eventId)" fit="cover">
              <template #error>
                <el-image class="event-image" :src="'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'" fit="cover"/>
              </template>
            </el-image>
            <div class="info-container">
              <div class="date">
                {{ event.date }}
              </div>
              <div class="event-title">
                {{ event.title }}
              </div>
              <div class="tags" >
                <el-tag class="tag" size="small" v-for="cat in getEventCategories(event.categories)" :key="cat">{{ cat.name }}</el-tag>
              </div>
              <el-divider>
                <div v-if="event.capacity != null">{{ event.numAcceptedAttendees }}/{{ event.capacity }} Attendees</div>
                <div v-else>{{ event.numAcceptedAttendees }} Attendees</div>
              </el-divider>

              <div class="host-container">
                <el-avatar :src="event.organizerImage"></el-avatar>
                <div class="host-name">
                  {{ event.organizerFirstName }} {{ event.organizerLastName }}
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-scrollbar>
    </el-card>


    <!-- Attendees -->
    <el-card class="container sub-container attendees-container">
      <el-header>
        Attendees
      </el-header>
      <el-table :data="attendees">
        <el-table-column width="50">
          <template #default="scope">
            <el-avatar :src="getAttendeeImage(scope.row.attendeeId)">
              <template #error>
                <el-avatar icon="el-icon-user-solid" shape="square"></el-avatar>
              </template>
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="firstName" label="First Name" ></el-table-column>
        <el-table-column prop="lastName" label="Last Name"></el-table-column>
      </el-table>

    </el-card>
  </el-container>
</template>

<script>
import api from "../Api";
import 'element-plus/lib/theme-chalk/display.css';
import EventEdit from "./EventEdit";

export default {
  name: "Event",
  components: {EventEdit},
  data: function() {
    return {
      event: null,
      eventImage: "",
      similarEvents: [],
      allCategories: [],
      attendees: [],
      requestedAttendees: [],
      status: "",

      attendanceButtonText: "Request to Join",
      deleteDialogVisible: false,
      attendanceDrawerVisible: false,
      editModal: false,

    }
  },

  methods: {
    getEvent: function(eventId) {
      api.getEvent(eventId)
        .then((res) => {
          this.event = res.data;
          this.eventImage = this.getEventImage(this.event.id);
          this.event.date = this.event.date.replace("T", " ");
          this.event.date = this.event.date.replace("Z", "");
          if (this.event.attendeeCount == null) {
            this.event.attendeeCount = 0;
          }
          this.getSimilarEvents();
          console.log(this.event);
        })
        .catch((error) => {
          this.$message.error("Event page not found.");
          this.$router.push("/events");
          console.log(error);
        });
    },

    getSimilarEvents: function() {
      let params = {};
      params.categoryIds = this.event.categories;
      api.searchEvents(params)
        .then((res) => {
          this.similarEvents = res.data.filter(e => e.eventId !== this.event.id && new Date(e.date) >= Date.now());

          for (let i = 0; i < this.similarEvents.length;  i++) {
            this.similarEvents[i].date = this.similarEvents[i].date.replace("T", " ");
            this.similarEvents[i].date = this.similarEvents[i].date.replace("Z", "");
            api.getEvent(this.similarEvents[i].eventId)
                .then((res) => {
                  this.similarEvents[i]["organizerImage"] = api.getUserImage(res.data.organizerId);
                });
          }

        })
        .catch((error) => {
          this.$message.error("Event page not found.");
          console.log(error);
        });
    },

    getEventImage: function(eventId) {
      return api.getEventImage(eventId);
    },

    getAllCategories: function() {
      api.getEventCategories()
          .then((res) => {
            this.allCategories = res.data;
            console.log("retrieved event categories.");
          })
          .catch((error) => {
            console.log("internal server error getting event categories: " + error);
          });
    },

    getEventCategories: function(eventCategories) {
      return this.allCategories.filter(category => eventCategories.includes(category.id));
    },

    getHostImage: function(userId) {
      return api.getUserImage(userId);
    },

    getAttendees: function(eventId) {
      api.getEventAttendees(eventId)
        .then((res) => {
          this.attendees = res.data;
          let loggedInId = parseInt(sessionStorage.getItem("userId"));

          let filtered = this.attendees.filter(attendee => attendee.attendeeId === loggedInId);
          if (filtered.length !== 0) {
            this.status = filtered[0].status;
          }

          if (this.isOrganizer()) {
            this.requestedAttendees = this.attendees.filter(attendee => attendee.status === "pending");
            this.attendees = this.attendees.filter(attendee => attendee.status !== "rejected");
          }

          console.log(this.attendees);
        })
        .catch((error) => {
          if (error.response.status === 404) {
            this.$message.error("Attendees for this event could not be found.");
          }
          console.log(error);
        });
    },

    getAttendeeImage: function(userId) {
      return api.getUserImage(userId);
    },

    isFutureDate: function() {
      return new Date(this.event.date) >= Date.now();
    },

    checkCanLeave: function() {
      if (new Date(this.event.date) < Date.now()) {
        return false;
      }

      if (sessionStorage.getItem("token") == null) {
        return false;
      }

      if (this.status === "pending") {
        return true;
      }

      if (this.status === "accepted") {
        return true;
      }

      if (this.status === "rejected") {
        return false;
      }

    },

    checkAttendanceEligibility: function() {
      if (new Date(this.event.date) < Date.now()) {
        this.attendanceButtonText = "This event is already over";
        return false;
      }

      if (sessionStorage.getItem("token") == null) {
        this.attendanceButtonText = "Login to join";
        return false;
      }

      if (this.status === "pending") {
        this.attendanceButtonText = "Request Pending";
        return false;
      }

      if (this.status === "accepted") {
        this.attendanceButtonText = "Joined";
        return false;
      }

      if (this.status === "rejected") {
        this.attendanceButtonText = "Rejected from joining";
        return false;
      }

      if (this.event.capacity == null) {
        this.attendanceButtonText = this.event.requiresAttendanceControl === 1 ?  "Request to Join" : "Join";
        return true;
      }

      if (this.event.attendeeCount < this.event.capacity) {
        this.attendanceButtonText = this.event.requiresAttendanceControl === 1 ?  "Request to Join" : "Join";
        return true;
      }
      else {
        this.attendanceButtonText = "Event at maximum capacity.";
        return false;
      }

    },

    leaveEvent: function() {
      api.deleteAttendee(this.event.id)
        .then(() => {
          this.status = "";
          this.$message.success("You have successfully left the event.")
          this.getEvent(this.event.id);
          this.getAttendees(this.event.id);
        })
        .catch((error) =>{
          console.log(error);
          if (error.response.status) {
            this.$message.error(error.response.statusText);
          }
        });
    },

    requestAttendance: function() {

      api.addAttendance(this.event.id)
        .then(() => {
          if (this.event.requiresAttendanceControl === 1) {
            this.$message.success("Successfully requested to join event.");
            this.status = "pending";
          }
          else {
            this.$message.success("Successfully joined event.");
            this.status = "accepted";
            this.getEvent(this.event.id);
            this.getAttendees(this.event.id);
          }

        })
        .catch((error) => {
          console.log(error);
          if (error.response.status) {
            this.$message.error(error.response.statusText);
          }
        });

    },

    changeAttendeeStatus: function(attendee, status) {
      api.changeAttendeeStatus(this.event.id, attendee.attendeeId, status)
        .then(() => {
          this.getAttendees();
          if (status === "accepted") this.event.attendeeCount++;
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status) {
            this.$message.error(error.response.statusText);
          }
        });
    },

    isOrganizer: function() {
      return this.event.organizerId === parseInt(sessionStorage.getItem("userId"));
    },

    deleteEvent: function() {
      api.deleteEvent(this.event.id)
        .then(() => {
          this.deleteDialogVisible = false;
          this.$message.success("Successfully deleted event.");
          this.$router.push("/events");
        })
        .catch((error) => {
          console.log(error);
          this.$message.error(error.response.statusText);
        });
    },

    goToEvent: function(eventId) {
      this.loadEventData(eventId);
      this.$router.push(`/events/${eventId}`);
      window.scrollTo(0, 0);
    },

    loadEventData: function(eventId) {
      this.getEvent(eventId);
      this.getAttendees(eventId);
    },

    editFinish: function() {
      this.eventImage = "";
      this.getEvent(this.event.id);
      this.editModal = false;
    },

  },

  mounted: function() {
    this.getAllCategories();
    this.loadEventData(this.$route.params.id);
  }

}
</script>

<style scoped>
  .container {
    width: 50%;
  }


  /* Header */
  #header {
    display: flex;
    justify-content: space-between;
    height: fit-content;
  }

  #title {
    font-size: 32px;
    text-align: left;
  }

  #fee {
    padding-top: 0.5em;
    font-size: 18px;
  }

  #organizer-header {
    display: flex;
    flex-direction: row;

    padding-top: 0.5em;
    margin: auto;
  }

  #organizer-container {
    margin: auto;
    padding: 0 0.5em;

    font-size: 16px;
    text-align: end;
  }

  #host {
    font-size: 16px;
  }

  .attendees {
    text-align: right;
    margin: 0 0 auto 0;
  }

  /* Image Container */
  #image-container {
    margin-bottom: 1em;

  }

  #event-image {
  }

  /* Information Container */
  #info-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: auto;
    grid-row-gap: 1em;

  }

  #tags {
    grid-column: 1 / 3;

    text-align: left;

  }

  .tag {
    margin: 0.5em;
  }

  #date {
    grid-column: 1;
    text-align: left;

  }

  .location {
    grid-column: 1;

    text-align: left;

  }

  #description {
    line-height: 24px;
    text-align: left;
  }

  /* Similar Events */
  .sub-container {
    margin-top: 1em;
  }

  .event-card {
    width: 300px;
    margin: 0.5em 0.5em;
    cursor: pointer;
  }

  .info-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(auto-fit, 1fr);

    padding: 20px;
  }

  .event-image {
    width: 100%;
    height: 250px;
  }

  .event-title {
    font-size: 20px;
    padding: 1em;
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

  /** Attendees Styling **/
  .attendees-container {
    margin-bottom: 4em;
  }

  #request-attendees-table {
    width: 90%;
    margin: auto;
  }


</style>