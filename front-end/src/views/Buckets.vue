<template>
  <div class="bucket">
    <div class="leftovers">
      <h1>{{this.$root.$data.user.fname}}'s Buckets</h1>
      <p class="bincome">Income: ${{this.income}}</p>
      <p class="bspent">{{this.$root.$data.user.fname}}'s Total Spent this Month {{this.spent}}</p>
      <p class="bbucketed">{{this.$root.$data.user.fname}}'s Total amount put in Buckets {{this.bucketed}} (this is reset when you reload)</p>
      <p class="bextra">{{this.$root.$data.user.fname}}'s Extra {{this.leftover}}</p>
    </div>

    <div class="plusMinus">
      <button class="buttons" id="plus" @click="showAddBucketPop()">Add Bucket</button>
      <button class="buttons" id="minus" @click="showDeleteBucketPop()">Delete Bucket</button>
    </div>

    <transition v-if="showAddBucketBool" name="addBucket">
      <div class="addBucket-mask">
        <div class="addBucket-wrapper">
          <div class="addBucket-container">
            <button id="exit-button" class="buttons" @click="showAddBucketPop()">X</button>
            <form class="pure-form pure-form-aligned" @submit.prevent="addBucket">
              <fieldset>
                <legend>New Bucket</legend>
                <div class="pure-control-group">
                  <label for="name">Bucket Name: </label>
                  <input id="name" v-model="bucketName" placeholder="name">
                </div>
                <div class="pure-control-group">
                  <label for="monthly">Monthly Payment: </label>
                  <input id="monthly" v-model="bucketPayment" placeholder="Monthly Payment Goal">
                </div>
                <div class="pure-control-group">
                  <label for="current">Current if any: </label>
                  <input id="current" v-model="bucketCurrent" placeholder="Current amount saved if any">
                </div>
                <div class="pure-controls">
                  <button type="submit" class="buttons">Add Bucket</button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </transition>

    <transition v-if="showDeleteBucketBool" name="addBucket">
      <div class="addBucket-mask">
        <div class="addBucket-wrapper">
          <div class="addBucket-container">
            <button id="exit-button" class="buttons" @click="showDeleteBucketPop()">X</button>
            <form class="pure-form pure-form-aligned" @submit.prevent="deleteBucket()">
              <fieldset>
                <legend>Delete a Bucket</legend>
                <label for="categorySelector">Select a Bucket: </label>
                  <select v-model="bucket" id="categorySelector">
                    <option disabled value="">Select a Category:</option>
                    <option v-bind:value="bucket" v-for="bucket in buckets" :key="bucket._id">{{bucket.name}}</option>
                  </select>
                <div class="pure-controls">
                  <button type="submit" class="buttons">Delete</button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </transition>

    <div class="grid-container">
      <div v-for="bucket in buckets" :key="bucket._id" class="buckets">
        <button class="buttons" id="editBucketButton" @click="showEditBucketPop()">Edit</button>
        <h3 class="bucketInfo">{{bucket.name}}</h3>
        <p class="bucketInfo">Total Saved: {{bucket.current}}</p>
        <p class="bucketInfo">Monthly Payment: {{bucket.payment}}</p>
        <button class="buttons" id="bucketButtons1" @click="makePayment(bucket)">Make Monthly Payment</button>
        <button class="buttons" id="bucketButtons2" @click="makePayment(bucket)">Make Custom payment</button>
      </div>
    </div>

    <transition v-if="showEditBucketBool" name="addBucket">
      <div class="addBucket-mask">
        <div class="addBucket-wrapper">
          <div class="addBucket-container">
            <button id="exit-button" class="buttons" @click="showEditBucketPop(bucket)">X</button>
            <form class="pure-form pure-form-aligned" @submit.prevent="editBucket(bucket)">
              <fieldset>
                <legend>{{this.bucketToBeEditied.name}}</legend>
                <p>Please enter all the information before saving</p>
                <div class="pure-control-group">
                  <label for="name">New Name: </label>
                  <input id="name" v-model="newBucketName" placeholder="name">
                </div>
                <div class="pure-control-group">
                  <label for="monthly">New Monthly Payment: </label>
                  <input id="monthly" v-model="newBucketPayment" placeholder="Monthly Payment Goal">
                </div>
                <div class="pure-control-group">
                  <label for="current">Current if any: </label>
                  <input id="current" v-model="newBucketCurrent" placeholder="Current amount saved if any">
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

  </div>
</template>

<script>
import axios from 'axios';
  export default {
    name: 'Buckets',
    data () {
      return {
        expenses: [],
        expense: null,
        spent: 0,
        leftover: 0,
        bucketed: 0,
        buckets: [],
        bucket: null,
        editIncomeBool: false,
        income: this.$root.$data.user.income,
        showAddBucketBool: false,
        bucketName: '',
        bucketPayment: '',
        bucketCurrent: '0',
        newBucketName: '',
        newBucketPayment: '',
        newBucketCurrent: '0',
        showDeleteBucketBool: false,
        totalSpentOnBuckets: 0,
        payment: '',
        showEditBucketBool: false,
        bucketToBeEditied: null,
      }
    },
    created () {
      this.getExpenses();
    },
    methods: {
      async getExpenses() {
        try {
          let response = await axios.get("/api/expense");
          this.expenses = response.data;
          this.getBuckets();
        } catch (error) {
          console.log(error);
        }
      },
      getTotals() {
        this.spent = 0;
        for(var i = 0; i < this.expenses.length; ++i) {
          if(this.expenses[i].actual != undefined) {
            this.spent = parseInt(this.spent) + parseInt(this.expenses[i].actual);
          }
        }
        this.leftover = parseInt(this.$root.$data.user.income) - parseInt(this.spent);
      },
      async getBuckets() {
        try {
          let response = await axios.get("/api/bucket");
          this.buckets = response.data;
          if(this.buckets.length == 0) {
            this.deleteBucketAsExpense();
          }
          this.getTotals();
        } catch (error) {
          console.log(error);
        }
      },
      showAddBucketPop() {
        if(this.showAddBucketBool) {
          this.showAddBucketBool = false;
        }
        else {
          this.showAddBucketBool = true;
        }
      },
      showDeleteBucketPop() {
        if(this.showDeleteBucketBool) {
          this.showDeleteBucketBool = false;
        }
        else {
          this.showDeleteBucketBool = true;
        }
      },
      showEditBucketPop(bucket) {
        if(this.showEditBucketBool) {
          this.showEditBucketBool = false;
          this.bucketToBeEditied = null;
        }
        else {
          this.showEditBucketBool = true;
          this.bucketToBeEditied = bucket;
        }
      },
      async addBucket() {
        try {
          await axios.post("/api/bucket", {
            name: this.bucketName,
            current: this.bucketCurrent,
            payment: this.bucketPayment,
          });
          if(this.buckets.length == 0) {
            this.ceateBucketAsExpense();
          }
          this.showAddBucketPop();
          this.getExpenses();
        } catch (error) {
          console.log(error);
          this.error = error.response.data.message;
        }
      },
      async makePayment(bucket) {
        try {
          var currentPass = parseInt(bucket.current) + parseInt(bucket.payment);
          await axios.put("/api/bucket/" + bucket._id, {
            current: currentPass,
          });
          this.payment = bucket.payment;
          console.log('payment');
          console.log(this.payment);
          this.updateBucketAsExpense();
        } catch (error) {
          console.log(error);
          this.error = error.response.data.message;
        }
      },
      async createBucket() {
        try {
          await axios.post("/api/expense", {
            name: 'Bucket',
            max: this.expenseMax,
          });
          this.showDeleteBucketPop();
          this.getExpenses();
        } catch (error) {
          console.log(error);
          this.error = error.response.data.message;
        }
      },
      async deleteBucket() {
        try {
          await axios.delete("/api/bucket/" + this.bucket._id);
          this.showDeleteBucketPop();
          this.getExpenses();
        } catch (error) {
          console.log(error);
          this.error = error.response.data.message;
        }
      },
      async ceateBucketAsExpense() {
        try {
          await axios.post("/api/expense", {
            name: 'My Buckets',
            max: '0',
            actual: '0',
          });
        } catch (error) {
          console.log(error);
          this.error = error.response.data.message;
        }
      },
      async deleteBucketAsExpense() {
        var bucketExpenseID;
        for(var i = 0; i < this.expenses.length; ++i) {
          if(this.expenses[i].name == "My Buckets") {
            bucketExpenseID = this.expenses[i]._id
          }
        }
        try {
          await axios.delete("/api/expense/" + bucketExpenseID);
        } catch (error) {
          console.log(error);
          this.error = error.response.data.message;
        }
      },
      async updateBucketAsExpense() {
        this.totalSpentOnBuckets = 0
        for(var i = 0; i < this.expenses.length; ++i) {
          if(this.expenses[i].name == "My Buckets") {
            if(this.expenses[i].actual != undefined) {
              this.totalSpentOnBuckets = parseInt(this.expenses[i].actual) + parseInt(this.payment);
            }
            else {
              this.totalSpentOnBuckets = parseInt(this.payment);
            }
          }
        }
        this.bucketed = this.totalSpentOnBuckets;
        try {
          await axios.put("/api/expense", {
            name: 'My Buckets',
            actual: this.totalSpentOnBuckets,
            max: this.bucketed,
          });
          this.getExpenses();
        } catch (error) {
          console.log(error);
          this.error = error.response.data.message;
        }
      },
      async editBucket() {
        try {
          await axios.put("/api/bucket/" + this.bucketToBeEditied._id, {
            current: this.newBucketCurrent,
            name: this.newBucketName,
            payment: this.newBucketPayment,
          });
          this.showEditBucketPop();
          this.getExpenses();
        } catch (error) {
          console.log(error);
          this.error = error.response.data.message;
        }
      },
    }
  }
</script>

<style scoped>
.leftovers {
  text-align: center;
}
.bincome {
  font-weight: bold;
}
.bspent {
  color: #BB9F06;
}
.bbucketed {
  color: #5AAA95;
}
.bextra {
  color: #087F8C;
}
#plus {
  float: right;
  margin: 10px;
}
#minus {
  float: left;
  margin: 10px;
}
.plusMinus:after {
  content: "";
  display: table;
  clear: both;
}
.grid-container {
  display: grid;
  grid-template-columns: auto auto auto;
  grid-row-gap: 40px;
  grid-column-gap: 40px;
  padding: 10px;
  margin: 5%;
  margin-top: 0px;
  text-align: center;
}
.buckets {
  display: block;
  background-color: #9EB88E;
  border-radius: 15px;
}
#bucketButtons1 {
  font-size: 10px;
  padding: 5px;
  margin-bottom: 16px;
  float: right;
  margin-right: 10px;
}
#bucketButtons2 {
  font-size: 10px;
  padding: 5px;
  margin-bottom: 16px;
  float: left;
  margin-left: 10px;
}
/* addBuckets */
.addBucket-mask {
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
.addBucket-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.addBucket-container {
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
  * transition="addBucket" when their visibility is toggled
  * by Vue.js.
  *
  * You can easily play with the addBucket transition by editing
  * these styles.
  */
.addBucket-enter {
  opacity: 0;
}
.addBucket-leave-active {
  opacity: 0;
}
.addBucket-enter .addBucket-container,
.addBucket-leave-active .addBucket-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.addBucket-container h1 {
  margin-top: 0;
}
#exit-button {
  position: relative;
  left: 50%;
  top: -5px;
  padding: 2px 5px;
}
#editBucketButton {
  position: relative;
  right: 41%;
  margin-top: 3%;
  font-size: 12px;
  padding: 7px;
}
.bucketInfo {
  position: relative;
  top: -10%;
}
</style>
