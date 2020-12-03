<template>
  <div id="app">
    <div id="nav">
      <ul class="nav-bar">
        <li class="navLink"><router-link class="routerLink" to="/buckets">Buckets</router-link></li>
        <li class="navLink"><router-link class="routerLink" to="/budget">Budget</router-link></li>
        <li class="navLink"><router-link class="routerLink" to="/">Home</router-link></li>
        <li class="websiteLink"><router-link class="routerLink" to="/">HardBudget</router-link></li>
      </ul>
    </div>
    <router-view v-if="user" />
    <div v-else>
      <Login />
    </div>
  </div>
</template>

<script>
import Login from '@/components/Login.vue';
import axios from 'axios';
export default {
  name: 'app',
  components: {
    Login,
  },
  async created() {
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    }
  }
}
</script>

<style>
body {
  margin: 0px;
  padding: 0px;
}

#nav {
  background-color: #087F8C;
}
.nav-bar {
  margin: 0;
  padding: 0;
  list-style-type: none;
  overflow: hidden;
}
.navLink {
  float: right;

  transition-duration: 0.4s;
}
.websiteLink {
  float: left;
  transition-duration: 0.4s;
}
.routerLink {
  padding: 20px;
  display: block;
  color: white;
  text-align: center;
  text-decoration: none;
}
.navLink:hover, .websiteLink:hover {
  background-color: #095256;
}

/*styles used everywhere*/
.buttons {
  background-color: #087F8C;
  border: none;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  font-size: 16px;
  border-radius: 5px;
  transition-duration: 0.4s;
}
.buttons:hover {
  background-color: #5AAA95;
}
</style>
