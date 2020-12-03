<template>
  <div class="home">
      <h1>{{this.$root.$data.user.fname}} {{this.$root.$data.user.lname}}'s Budget</h1>
      <p v-on:click="editIncome()" id="displayIncome">Income: ${{this.$root.$data.user.income}}</p>
      <input v-on:keyup.enter="incomeSubmit" id="incomeInput" placeholder="income, number only" v-model="income">
      <br/>

      <transition v-if="showAddExpenseBool" name="addExpense">
        <div class="addExpense-mask">
          <div class="addExpense-wrapper">
            <div class="addExpense-container">
              <button id="exit-button" class="buttons" @click="showAddExpensePop()">X</button>
              <form class="pure-form pure-form-aligned" @submit.prevent="addExpense">
                <fieldset>
                  <legend>New Expense</legend>
                  <div class="pure-control-group">
                    <label for="expense">Expense</label>
                    <input id="name" v-model="expenseName" placeholder="Expense">
                  </div>
                  <div class="pure-control-group">
                    <label for="price">Max</label>
                    <input id="price" v-model="expenseMax" placeholder="Max of this expense">
                  </div>
                  <div class="pure-controls">
                    <button type="submit" class="buttons">Add Expense</button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </transition>

      <section class="container">
        <div class="columns">
          <div class="column">
            <h2 class="graph-title">Monthly Expenses</h2>
            <reactive :chart-data="datacollection" @on-receive="showAddCostPop"></reactive>
          </div>
        </div>
      </section>

      <button class="buttons" id="addCategoryButton" @click="showAddExpensePop()">Add Category</button>
      <button class="buttons" id="addCostButton" @click="showAddCostPop()">Add Cost</button>
      <button class="buttons" id="resetCostButton" @click="showResetCostPop()">Reset Cost</button>
      <button class="buttons" id="deleteCategoryButton" @click="showDeleteExpensePop()">Delete Category</button>

      <transition v-if="showAddCostBool" name="addCost">
        <div class="addCost-mask">
          <div class="addCost-wrapper">
            <div class="addCost-container">
              <button id="exit-button" class="buttons" @click="showAddCostPop()">X</button>
              <form class="pure-form pure-form-aligned" @submit.prevent="addCost()">
                <fieldset>
                  <legend>New Cost</legend>
                  <label for="categorySelector">Select a Category: </label>
                    <select v-model="expense" id="categorySelector">
                      <option disabled value="">Select a Category:</option>
                      <option v-bind:value="expense" v-for="expense in expenses" :key="expense._id">{{expense.name}}</option>
                    </select>
                  <div class="pure-control-group">
                    <label for="cost">Cost</label>
                    <input id="cost" v-model="actual" placeholder="Cost">
                  </div>
                  <div class="pure-controls">
                    <button type="submit" class="buttons">Add Cost</button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </transition>

      <transition v-if="showResetCostBool" name="resetCost">
        <div class="resetCost-mask">
          <div class="resetCost-wrapper">
            <div class="resetCost-container">
              <button id="exit-button" class="buttons" @click="showResetCostPop()">X</button>
              <form class="pure-form pure-form-aligned" @submit.prevent="resetCost()">
                <fieldset>
                  <legend>Reset Cost</legend>
                  <label for="categorySelector">Select a Category: </label>
                    <select v-model="expense" id="categorySelector">
                      <option disabled value="">Select a Category:</option>
                      <option v-bind:value="expense" v-for="expense in expenses" :key="expense._id">{{expense.name}}</option>
                    </select>
                  <div class="pure-control-group">
                    <label for="cost">New Total Cost</label>
                    <input id="cost" v-model="actual" placeholder="Cost">
                  </div>
                  <div class="pure-controls">
                    <button type="submit" class="buttons">Reset</button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </transition>

      <transition v-if="showDeleteExpenseBool" name="deleteExpense">
        <div class="deleteExpense-mask">
          <div class="deleteExpense-wrapper">
            <div class="deleteExpense-container">
              <button id="exit-button" class="buttons" @click="showDeleteExpensePop()">X</button>
              <form class="pure-form pure-form-aligned" @submit.prevent="deleteExpense()">
                <fieldset>
                  <legend>Delete an Expense</legend>
                  <label for="categorySelector">Select a Category: </label>
                    <select v-model="expense" id="categorySelector">
                      <option disabled value="">Select a Category:</option>
                      <option v-bind:value="expense" v-for="expense in expenses" :key="expense._id">{{expense.name}}</option>
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

  </div>
</template>

<script>
import axios from 'axios';
import Reactive from '@/components/Reactive'
export default {
  name: 'Budget',
  components: {
    Reactive,
  },
  data() {
    return {
      income: this.$root.$data.user.income,
      editIncomeBool: false,
      expenses: [],
      expense: null,
      expenseName: '',
      expenseMax: '',
      expenseActual: '',
      showAddExpenseBool: false,
      datacollection: null,
      showAddCostBool: false,
      actual: 0,
      showDeleteExpenseBool: false,
      showResetCostBool: false,
      actualColorGood: '#5AAA95',
      actualColorBad: '#BB9F06',
    }
  },
  created () {
    this.getExpenses();
  },
  methods: {
    fillData () {
      var labelsTemp = [];
      var dataMaxTemp = [];
      var dataActualTemp = [];
      var totalSpent = 0;
      var colors = [];
      for(var i = 0; i < this.expenses.length; ++i) {
        labelsTemp.push(this.expenses[i].name);
        dataMaxTemp.push(this.expenses[i].max);
        dataActualTemp.push(this.expenses[i].actual);
        if(this.expenses[i].actual != undefined) {
          totalSpent = parseInt(totalSpent) + parseInt(this.expenses[i].actual);
        }
        if( parseInt(this.expenses[i].actual) > parseInt(this.expenses[i].max) ) {
          colors.push(this.actualColorBad);
        }
        else {
          colors.push(this.actualColorGood);
        }
      }
      labelsTemp.push('Total Income V.S. Total Expenses');
      dataMaxTemp.push(this.income);
      dataActualTemp.push(totalSpent);
      if( parseInt(this.income) < parseInt(totalSpent) ) {
        colors.push(this.actualColorBad);
      }
      colors.push(this.actualColorGood);

      this.datacollection =
      {
        labels: labelsTemp,
        datasets: [
          {
            label: 'Max Monthly Limit',
            backgroundColor: '#087F8C',
            data: dataMaxTemp
          },
          {
            label: 'Actual Spent This Month',
            backgroundColor: colors,
            data: dataActualTemp
          }
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
    incomeSubmit() {
      document.getElementById("incomeInput").style.display = "none";
      this.changeIncome();
    },
    editIncome(){
      document.getElementById("incomeInput").value = this.income;
      document.getElementById("incomeInput").style.display = "block";
      document.getElementById("displayIncome").style.display = "none";
      document.getElementById("incomeInput").focus();
      this.editIncomeBool = true;
    },
    showAddExpensePop() {
      if(this.showAddExpenseBool) {
        this.showAddExpenseBool = false;
      }
      else {
        this.showAddExpenseBool = true;
        this.expenseName = '',
        this.expenseMax = ''
      }
    },
    showAddCostPop() {
      if(this.showAddCostBool) {
        this.showAddCostBool = false;
      }
      else {
        this.showAddCostBool = true;
      }
    },
    async addCost() {
      if(this.expense.actual != undefined) {
        this.actual = parseInt(this.actual) + parseInt(this.expense.actual);
      }
      try {
        await axios.put("/api/expense/" + this.expense._id, {
          actual: this.actual,
        });
        this.showAddCostPop();
        this.getExpenses();
        this.actual = 0;
      } catch (error) {
        console.log(error);
        this.error = error.response.data.message;
      }
    },
    async changeIncome() {
      try {
        await axios.put("/api/users/" + this.$root.$data.user._id, {
          income: this.income,
        });
        document.getElementById("displayIncome").innerHTML = "Income: $" + this.income;
        document.getElementById("displayIncome").style.display = "block";
        this.fillData();
      } catch (error) {
        console.log(error);
        this.error = error.response.data.message;
      }
    },
    async addExpense() {
      try {
        await axios.post("/api/expense", {
          name: this.expenseName,
          max: this.expenseMax,
        });
        this.showAddExpensePop();
        this.getExpenses();
        this.createButton();
      } catch (error) {
        console.log(error);
        this.error = error.response.data.message;
      }
    },
    showResetCostPop() {
      if(this.showResetCostBool) {
        this.showResetCostBool = false;
      }
      else {
        this.showResetCostBool = true;
      }
    },
    async resetCost() {
      console.log(this.actual);
      try {
        await axios.put("/api/expense/" + this.expense._id, {
          actual: this.actual,
        });
        this.showResetCostPop();
        this.getExpenses();
        this.actual = 0;
      } catch (error) {
        console.log(error);
        this.error = error.response.data.message;
      }
    },
    showDeleteExpensePop() {
      if(this.showDeleteExpenseBool) {
        this.showDeleteExpenseBool = false;
      }
      else {
        this.showDeleteExpenseBool = true;
      }
    },
    async deleteExpense() {
      try {
        await axios.delete("/api/expense/" + this.expense._id);
        this.showDeleteExpensePop();
        this.getExpenses();
      } catch (error) {
        console.log(error);
        this.error = error.response.data.message;
      }
    }
  }
}
</script>

<style scoped>
.home h1 {
  text-align: center;
}
#displayIncome {
  text-align: center;
  font-size: 20px;
  margin-bottom: 0px;
}
/* addExpenses */
.addExpense-mask {
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
.addExpense-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.addExpense-container {
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
.addExpense-enter {
  opacity: 0;
}
.addExpense-leave-active {
  opacity: 0;
}
.addExpense-enter .addExpense-container,
.addExpense-leave-active .addExpense-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.addExpense-container h1 {
  margin-top: 0;
}

/* addExpenses */
.addCost-mask {
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
.addCost-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.addCost-container {
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
.addCost-enter {
  opacity: 0;
}
.addCost-leave-active {
  opacity: 0;
}
.addCost-enter .addCost-container,
.addCost-leave-active .addCost-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.addCost-container h1 {
  margin-top: 0;
}
/* resetCost */
.resetCost-mask {
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
.resetCost-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.resetCost-container {
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
.resetCost-enter {
  opacity: 0;
}
.resetCost-leave-active {
  opacity: 0;
}
.resetCost-enter .addCost-container,
.resetCost-leave-active .addCost-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.resetCost-container h1 {
  margin-top: 0;
}
/* deleteExpense */
.deleteExpense-mask {
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
.deleteExpense-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.deleteExpense-container {
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
.deleteExpense-enter {
  opacity: 0;
}
.deleteExpense-leave-active {
  opacity: 0;
}
.deleteExpense-enter .addCost-container,
.deleteExpense-leave-active .addCost-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.deleteExpense-container h1 {
  margin-top: 0;
}
.graph-title {
  text-align: center;
}
#exit-button {
  position: relative;
  left: 50%;
  top: -5px;
  padding: 2px 5px;
}
#incomeInput {
  display: none;
  margin-left: 45%;
}

legend {
  font-size: 25px;
}

.pure-control-group {
  margin-left: -10%;
}

#categorySelector {
  margin-bottom: 2%;
}

#addCategoryButton, #deleteCategoryButton {
  float: right;
  margin-right: 5%;
  margin-top: 2%;
}
#addCostButton, #resetCostButton{
  float: left;
  margin-left: 5%;
  margin-top: 2%;
}
.doughnutDiv {
  margin-top: 15%;
}
.doughnutDiv h3 {
  text-align: center;
}
</style>
