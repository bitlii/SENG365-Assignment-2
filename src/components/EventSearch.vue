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

    <div id="event-container">

      <el-card class="event-card" v-for="event in eventsList" :key="event.eventId" :body-style="{ padding: '0px' }">
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
          <div class="tags">
           <el-tag class="tag">Film</el-tag>
           <el-tag class="tag">Entertainment</el-tag>
          </div>

          <el-divider>
            <div v-if="event.capacity != null">{{ event.numAcceptedAttendees }}/{{ event.capacity }} Attendees</div>
            <div v-else>{{ event.numAcceptedAttendees }} Attendees</div>
          </el-divider>
          <div class="host-container">
            <el-avatar></el-avatar>
            <div class="host-name">
              {{ event.organizerFirstName }} {{ event.organizerLastName }}
            </div>
          </div>

        </div>
      </el-card>


    </div>

  </el-card>
</template>

<script>
import api from "../Api.js";

export default {
  name: "EventSearch",

  data: function() {
    return {
      eventsList: [],

      searchQuery: "",
      count: 15,

    }
  },

  methods: {
    getAllEvents: function() {
      api.getAllEvents()
        .then((res) => {
          this.eventsList = res.data;
        })
        .catch((error) => {
          if (error.response.status === 400) {
            this.$message.error(error.response.statusText);
          }
          console.log(error);
        });
    },

    getEventImage:  function(eventId) {
      console.log(api.getEventImage(eventId));
      return api.getEventImage(eventId);
    }

  },

  mounted: function() {
    if (sessionStorage.getItem("token") == null) {
      this.$message.error("You must log in first.");
      this.$router.push("/");
    }
    this.getAllEvents();

  }

}
</script>

<style scoped>
  #event-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: repeat(auto-fit, auto);
  }

  .info-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(auto-fit, auto);

    padding: 20px;
  }

  .event-card {
    margin: 0.5em 0.5em;
  }

  .event-image {
    width: 100%;
    height: 250px;
  }

  .event-title {
    padding: 1em;
    font-size: 20px;
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