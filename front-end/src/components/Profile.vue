<template>
<div class="admin">
  <h1>My Client Portal</h1>
  <button class="pure-button pure-button-primary" @click="showAddJobModal">Add Job</button>
  <div class="logout">
    <button class="pure-button pure-button-primary" @click="logout">Logout</button>
  </div>
  <h2>My Jobs</h2>
  <div class="job" v-for="job in jobs" v-bind:key="job._id" @click="selectJob(job)">
    <h3>Job: {{job.name}}</h3>
    <p>Price: {{job.price}}</p>
    <p>Description: {{job.description}}</p>
  </div>

  <!-- Add Client Modal -->
  <transition v-if="showAddJob" name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <form class="pure-form pure-form-aligned" @submit.prevent="addJob">
            <fieldset>
              <legend>Add a Job</legend>
              <div class="pure-control-group">
                <label for="name">Name</label>
                <input id="name" v-model="jobName" placeholder="Name">
              </div>
              <div class="pure-control-group">
                <label for="price">Price</label>
                <input id="price" v-model="jobPrice" placeholder="Price">
              </div>
              <div class="pure-control-group">
                <label for="description">Description</label>
                <textarea id="description" v-model="jobDescription" placeholder="Description"></textarea>
              </div>
              <div class="pure-controls">
                <button type="button" @click="closeAddJobModal" class="pure-button">Close</button>
                <button type="submit" class="pure-button pure-button-primary">Add Job</button>
              </div>
            </fieldset>
          </form>
          <p v-if="error" class="error">{{error}}</p>
        </div>
      </div>
    </div>
  </transition>

  <!-- View Client Modal -->
  <transition v-if="showViewJob" name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <h1 class="modal-title">{{user.name}}'s Jobs</h1>
          <div class="client">
            <h3>Job: {{job.name}}</h3>
            <p>Price: {{job.price}}</p>
            <p>Description: {{job.description}}</p>
            <p>{{formatDate(job.created)}}</p>
          </div>
          <button type="button" @click="closeViewJobModal" class="pure-button">Close</button>
          <div class="deletebutton">
            <button type="button" @click="deleteJob(job)" class="pure-button">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</div>
</template>

<script>
import moment from 'moment';
import axios from 'axios';
export default {
  name: "Admin",
  data() {
    return {
      jobs: [],
      job: null,
      showAddJob: false,
      showViewJob: false,
      jobName: '',
      jobPrice: '',
      jobDescription: '',
      error: ''
    }
  },
  created() {
    this.getJobs();
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
  methods: {
    formatDate(date) {
      if (moment(date).diff(Date.now(), 'days') < 15)
        return moment(date).fromNow();
      else
        return moment(date).format('d MMMM YYYY');
    },
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
    showAddJobModal() {
      this.jobName = '';
      this.jobPrice = '';
      this.jobDescription = '';
      this.error = '';
      this.showAddJob = true;
    },
    closeAddJobModal() {
      this.showAddJob = false;
    },
    showViewJobModal() {
      this.error = '';
      this.showViewJob = true;
    },
    closeViewJobModal() {
      this.showViewJob = false;
    },
    selectJob(job) {
      this.job = job;
      this.showViewJobModal();
    },
    async getJobs() {
      try {
        let response = await axios.get("/api/jobs");
        this.jobs = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async addJob() {
      try {
        await axios.post("/api/jobs", {
          name: this.jobName,
          price: this.jobPrice,
          description: this.jobDescription
        });
        this.closeAddJobModal();
        this.getJobs();
      } catch (error) {
        console.log(error);
        this.error = error.response.data.message;
      }
    },
    async deleteJob(job) {
      try {
        console.log(job.name);
        console.log(job.price);
        console.log(job.description);
        console.log(job._id);
        await axios.delete("/api/jobs/" + job._id);
        this.getJobs();
        this.showViewJob = false;
      } catch (error) {
        console.log(error);
      }
    },
  }
}
</script>

<style scoped>
.admin {
  padding: 0px 100px;
}

/* Jobs */
.job {
  background-color: #eee;
  padding: 10px;
  margin-bottom: 10px;
}

.job:hover {
  background-color: #ccc;
  cursor: pointer;
}

/* Modals */
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 500px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h1 {
  margin-bottom: 30px;
  font-size: 1.5em;
}

/*
  * The following styles are auto-applied to elements with
  * transition="modal" when their visibility is toggled
  * by Vue.js.
  *
  * You can easily play with the modal transition by editing
  * these styles.
  */
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

form {
  font-size: 14px;
}

form legend {
  font-size: 20px;
}

input {
  margin-right: 10px;
  margin-bottom: 10px;
  width: 200px;
}

error {
  margin-top: 20px;
  display: inline;
  padding: 5px 20px;
  border-radius: 30px;
  font-size: 10px;
  background-color: #d9534f;
  color: #fff;
}

button {
  margin-right: 20px;
}

.modal-container h1 {
  font-size: 20px;
  border-bottom: 1px solid #3c8cbc;
}

h3 {
  font-size: 16px;
  font-weight: normal;
}

.logout {
  float: right;
}

textarea {
  margin-right: 10px;
  margin-bottom: 10px;
  width: 200px;
}

.deletebutton {
  float: right;
}
.deletebutton .pure-button:hover {
  background: #ff0000;
  color: black;
}
.deletebutton .pure-button {
  background-color: #ff3333;
  color: white;
}
</style>
