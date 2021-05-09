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
              <i class="el-icon-money"></i> Fee: {{ event.fee }}
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
        <el-image id="event-image" :src="getEventImage()">
          <template #error>
            <el-avatar icon="el-icon-picture" :size="200" shape="square"></el-avatar>
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
        <div class="location" v-else>
          <i class="el-icon-link"></i>
          <a :href="event.url">{{ event.url }}</a>
        </div>
      </div>

      <el-divider></el-divider>

      <div id="description">
        {{ event.description }}
      </div>
    </el-card>

    <!-- Attendees -->
    <el-card class="container attendees-container">
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

export default {
  name: "Event",

  data: function() {
    return {
      event: null,
      eventCategories: [],
      attendees: [],

    }
  },

  methods: {
    getEvent: function() {
      api.getEvent(this.$route.params.id)
        .then((res) => {
          this.event = res.data;
          if (this.event.attendeeCount == null) {
            this.event.attendeeCount = 0;
          }
          console.log(this.event);
        })
        .catch((error) => {
          this.$message.error("Event page not found.");
          console.log(error);
        });
    },

    getEventImage: function() {
      return api.getEventImage(this.$route.params.id);
    },

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

    getEventCategories: function(eventCategories) {
      return this.eventCategories.filter(category => eventCategories.includes(category.id));
    },

    getHostImage: function(userId) {
      return api.getUserImage(userId);
    },

    getAttendees: function() {
      api.getEventAttendees(this.$route.params.id)
        .then((res) => {
          this.attendees = res.data;
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
      console.log("ID IMAGE: " + userId);
      return api.getUserImage(userId);
    },

  },

  mounted: function() {
    this.getEvent();
    this.getAllCategories();
    this.getAttendees();
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

  /** Attendees Styling **/
  .attendees-container {
    margin-top: 1em;
    margin-bottom: 4em;
  }


</style>