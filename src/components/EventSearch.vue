<template>
  <el-card class="container">

    <!-- Search Box -->
    <el-header>
      <el-input placeholder="Search for events" @keyup.enter="searchEvents()" v-model="searchQuery">
        <template #append>
          <el-button icon="el-icon-search" @click="searchEvents()"></el-button>
        </template>
      </el-input>
    </el-header>

    <div id="advanced-settings-container">
      <div style="grid-row: 1; grid-column: 1/4;">Filter & Sort Options</div>

      <div id="sort-container">
        <el-select v-model="sortBy" @change="searchEvents()" size="medium" style="width: 150px">
          <el-option v-for="sort in sortRules" :key="sort.value" :label="sort.name" :value="sort.value"></el-option>
        </el-select>
        <el-select v-model="sortByDirection" @change="searchEvents()" size="medium" style="width: 120px">
          <el-option v-for="sort in sortDirection" :key="sort.value" :label="sort.name" :value="sort.value"></el-option>
        </el-select>
      </div>
      <div id="filter-container">
        <el-select v-model="filterCategoryIds" placeholder="Categories" @change="searchEvents()" multiple collapse-tags filterable>
          <el-option v-for="cat in eventCategories" :key="cat.id" :label="cat.name" :value="cat.id"></el-option>
        </el-select>
        <el-tooltip class="item" effect="dark" content="Events you are hosting or accepted to." placement="top-start">
          <el-button type="primary" @click="getUserEvents()">Your Events</el-button>
        </el-tooltip>
      </div>

      <el-divider direction="vertical" style="grid-row: 2; grid-column: 2; margin: auto"> </el-divider>

    </div>



    <el-divider></el-divider>

    <el-tabs type="card" @tab-click="handleTabChange">
      <el-tab-pane label="All Events">
        <!-- Event List Container -->
        <div class="event-container">
          <!-- Event Card Container -->
          <el-card class="event-card"
                   v-for="event in eventsList"
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
                <el-avatar></el-avatar>
                <div class="host-name">
                  {{ event.organizerFirstName }} {{ event.organizerLastName }}
                </div>
              </div>
            </div>

          </el-card>
        </div>
        <el-pagination
            @current-change="handlePageChange"
            background
            layout="prev, pager, next"
            :total="totalEvents"
            :page-size="count">

        </el-pagination>
      </el-tab-pane>
      <!-- Could probably refactor this into a single reusable component. -->
      <el-tab-pane label="My Events">
        <div class="event-container">
          <el-card class="event-card"
                   v-for="event in eventsList"
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
                <el-avatar></el-avatar>
                <div class="host-name">
                  {{ event.organizerFirstName }} {{ event.organizerLastName }}
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>


  </el-card>
</template>

<script>
import api from "../Api.js";

export default {
  name: "EventSearch",

  data: function() {
    return {
      allEvents: [], // contains every every from the request.
      eventsList: [], // contains only the currently viewable/paginated events.

      eventCategories: [],

      searchQuery: "",
      sortBy: "DATE",
      sortByDirection: "_ASC",
      organizerId: -1,
      filterCategoryIds: [],
      startIndex: 0,
      count: 10,

      totalEvents: 10,

      sortRules: [
        {name: "Alphabetical", value:"ALPHABETICAL"},
        {name: "Attendees", value:"ATTENDEES"},
        {name: "Capacity", value:"CAPACITY"},
        {name: "Date", value:"DATE"},
      ],
      sortDirection: [
        {name: "Ascending", value:"_ASC"},
        {name: "Descending", value:"_DESC"},
      ],

    }
  },

  methods: {
    searchEvents: function() {
      let params = {};

      if (this.searchQuery !== "") {
        params.q = this.searchQuery;
      }

      if (this.organizerId !== -1) {
        params.organizerId = this.organizerId;
      }

      if (this.filterCategoryIds.length !== 0) {
        params.categoryIds = this.filterCategoryIds;
      }

      if (this.sortBy != null && this.sortByDirection != null) {
        params.sortBy = this.sortBy.toString() + this.sortByDirection.toString();
      }

      console.log(params);
      api.searchEvents(params)
        .then((res) => {
          this.allEvents = res.data;
          this.startIndex = 0;
          this.eventsList = this.allEvents.slice(this.startIndex, this.startIndex + this.count);
          this.totalEvents = this.allEvents.length;
          this.eventsList = this.eventsList.filter(event => new Date(event.date) >= Date.now());
          // this.getOnlyCategoryFilterEvents();

        })
        .catch((error) => {
          if (error.response.status === 400) {
            this.$message.error("Bad search. Please try again.");
          }
          console.log(error);
        });
    },

    // getOnlyCategoryFilterEvents: function() {
    //   if (this.filterCategoryIds > 0) {
    //     let array = this.eventsList;
    //     console.log("FILTERED: " + this.filterCategoryIds);
    //     for (let catId in this.filterCategoryIds) {
    //       array.filter(e => e.categories.includes(catId));
    //       console.log("TEST: " + array);
    //     }
    //   }
    // },

    getEventImage:  function(eventId) {
      return api.getEventImage(eventId);
    },

    getEventCategories: function(eventCategories) {
      return this.eventCategories.filter(category => eventCategories.includes(category.id));
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

    getUserEvents: function() {
      this.organizerId = sessionStorage.getItem("userId");
      this.searchQuery = "";
      this.filterCategoryIds = [];
      this.searchEvents();

    },

    handlePageChange: function(page) {
      this.startIndex = (page * this.count) - 10;
      this.eventsList = this.allEvents.slice(this.startIndex, this.startIndex + this.count);
    },

    handleTabChange: function(tab) {
      if (tab.index === "0") {
        this.organizerId = -1;
        this.searchEvents();
      }
      else if (tab.index === "1") {
        this.getUserEvents();
      }

    },

    goToEvent: function(eventId) {
      this.$router.push(`/events/${eventId}`);
    },

  },

  mounted: function() {
    if (sessionStorage.getItem("token") == null) {
      this.$message.error("You must log in first.");
      this.$router.push("/");
    }

    this.getAllCategories();
    this.searchEvents();
  }

}
</script>

<style scoped>
  #advanced-settings-container {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 0.25fr 1fr;

    margin-top: 0.5em;
  }

  .event-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(auto-fit, auto);
  }

  #sort-container {
    grid-row: 2;
    grid-column: 1;

    display: inline-flex;
    justify-content: flex-start;

  }

  #filter-container {
    display: inline-flex;
    justify-content: space-between;
  }

  .info-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(auto-fit, 1fr);

    padding: 20px;
  }

  .event-card {
    margin: 0.5em 0.5em;
    cursor: pointer;
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

</style>