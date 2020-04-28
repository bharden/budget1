<template>
<div class="staff">

  <StaffProfile v-if="user === 'Ben'" />
  <StaffProfile v-else-if="user === 'Chris'" />
  <h1 v-else-if="user === 'fail'">I'm sorry this page is only for staff. If you are a member of the staff please try refreshing the page and verify you are logged in with your staff account. Thank you.</h1>
  <h1 v-else>I'm sorry this page is only for staff. If you are a member of the staff please try refreshing the page and verify you are logged in with your staff account. Thank you.</h1>
</div>
</template>

<script>
import StaffProfile from '@/components/StaffProfile.vue';
import axios from 'axios';
export default {
  name: 'Staff',
  components: {
    StaffProfile,
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
      if(this.$root.$data.user === null) {
        return 'fail';
      }
      else {
        return this.$root.$data.user.username;
      }
    }
  },
}
</script>

<style scoped>
.dashboard {
  padding-top: 10px;
}
h1 {
  border-style: solid;
  border-radius: 25px;
  margin-right: 25%;
  margin-left: 25%;
  margin-top: 10%;
  padding: 10px;
  background: #303740;
  color: #fff;
  font-size: 15px;
  text-align: center;
}
</style>
