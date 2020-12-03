<template>
  <div class="home">
    <h1>Welcome {{this.fname}} {{this.lname}}</h1>
    <button class="buttons" @click="logout()" id="logoutButton">Logout</button>
    <div class="profile">
      <p class="pinfo">First Name: {{this.fname}}</p>
      <p class="pinfo">Last Name: {{this.lname}}</p>
      <p class="pinfo">Username: {{this.username}}</p>
      <button class="buttons" @click="showEditProfilePop()">Edit Profile</button>
    </div>


    <transition v-if="showEditProfileBool" name="editProfile">
      <div class="editProfile-mask">
        <div class="editProfile-wrapper">
          <div class="editProfile-container">
            <button id="exit-button" class="buttons" @click="showEditProfilePop()">X</button>
            <form class="pure-form pure-form-aligned" @submit.prevent="editProfile()">
              <fieldset>
                <legend>Edit Profile</legend>
                <div class="pure-control-group">
                  <label for="fname">First Name: </label>
                  <input id="fname" v-model="fname" placeholder="first name">
                </div>
                <div class="pure-control-group">
                  <label for="lname">Last Name: </label>
                  <input id="lname" v-model="lname" placeholder="last name">
                </div>
                <div class="pure-control-group">
                  <label for="username">Userame: </label>
                  <input id="username" v-model="username" placeholder="username">
                </div>
                <div class="pure-controls">
                  <button type="submit" class="buttons">Save</button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </transition>

    <div class="doughnutDiv">
    <h3>Your Monthly Goals</h3>
    <doughnut :chart-data="datacollection"></doughnut>
  </div>

  </div>
</template>

<script>
import axios from 'axios';
import Doughnut from '@/components/Doughnut'
export default {
  name: "Home",
  components: {
    Doughnut,
  },
  data() {
    return {
      user: '',
      showEditProfileBool: false,
      fname: '',
      lname: '',
      username: '',
      datacollection: null,
      expenses: [],
      expense: null,
      colors: [
        '#095246',
        '#5AAA95',
        '#BB9F06',
        '#096971',
        '#70A984',
        '#C1A81D',
        '#087F8C',
        '#86A873',
        '#CCB745',
        '#632B30',
        '#22&4A5',
        '#59344F',
        '#857E7B',
        '#FAFAC6',
        '#FECDAA',
        '#253031',
        '#C6E0FF',
        '#BCAB79',
        '#E072A4',
        '#B0E298',
        '#095246',
        '#5AAA95',
        '#BB9F06',
        '#096971',
        '#70A984',
        '#C1A81D',
        '#087F8C',
        '#86A873',
        '#CCB745',
        '#632B30',
        '#22&4A5',
        '#59344F',
        '#857E7B',
        '#FAFAC6',
        '#FECDAA',
        '#253031',
        '#C6E0FF',
        '#BCAB79',
        '#E072A4',
        '#B0E298',
      ],
    }
  },
  created () {
    this.getUser();
    this.getExpenses();
  },
  methods: {
    getUser() {
      this.user = this.$root.$data.user;
      this.fname = this.user.fname;
      this.lname = this.user.lname;
      this.username = this.user.username;
    },
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
    showEditProfilePop() {
      if(this.showEditProfileBool == true) {
        this.showEditProfileBool = false;
      }
      else {
        this.showEditProfileBool = true;
      }
    },
    async editProfile() {
      try {
        await axios.put("/api/users/" + this.$root.$data.user._id, {
          fname: this.fname,
          lname: this.lname,
          username: this.username,
        });
        this.showEditProfilePop();
      } catch (error) {
        console.log(error);
        this.error = error.response.data.message;
      }
    },
    fillData () {
      var labels = [];
      var dataMax = [];

      for(var i = 0; i < this.expenses.length; ++i) {
        labels.push(this.expenses[i].name);
        dataMax.push(this.expenses[i].max);
      }

      this.datacollection =
      {
        labels: labels,
        datasets: [
          {
            labels: labels,
            backgroundColor: this.colors,
            data: dataMax
          },
        ]
      }
    },
    async getExpenses() {
      try {
        let response = await axios.get("/api/expense");
        this.expenses = response.data;
        this.fillData();
      } catch (error) {
        console.log(error);
      }
    },
  }
}
</script>

<style scoped>
.home h1 {
  text-align: center;
}
.profile {
  text-align: center;
  margin-bottom: 10%;
}
#editP {
  text-align: center;
}
#logoutButton {
  position: absolute;
  top: 70px;
  right: 2%;
}
/* deleteExpense */
.editProfile-mask {
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
.editProfile-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.editProfile-container {
  width: 50%;
  margin: 0px auto;
  padding: 10px 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
  text-align: center;
}
/*
  * The following styles are auto-applied to elements with
  * transition="addExpense" when their visibility is toggled
  * by Vue.js.
  *
  * You can easily play with the addExpense transition by editing
  * these styles.
  */
.editProfile-enter {
  opacity: 0;
}
.editProfile-leave-active {
  opacity: 0;
}
.editProfile-enter .addCost-container,
.editProfile-leave-active .addCost-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.editProfile-container h1 {
  margin-top: 0;
}
#exit-button {
  position: relative;
  left: 50%;
  top: -5px;
  padding: 2px 5px;
}

.doughnutDiv {
  text-align: center;
}
</style>
