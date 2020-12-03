const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();


const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  name: String,
  max: String,
  actual: String,
});

expenseSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
});

const Expense = mongoose.model('Expense', expenseSchema);

// create expense
router.post("/", validUser, async (req, res) => {

  const expense = new Expense({
    user: req.user,
    name: req.body.name,
    max: req.body.max,
  });
  try {
    await expense.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get expenses for specific user
router.get("/", validUser, async (req, res) => {
  // return photos
  try {
    let expenses = await Expense.find({
      user: req.user
    }).sort({
      created: -1
    }).populate('user');
    return res.send(expenses);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get all expenses
// router.get("/all", async (req, res) => {
//   try {
//     let expenses = await Expense.find().sort({
//       created: -1
//     }).populate('user');
//     return res.send(expenses);
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
//   }
// });


//update bucket expense for particular user
router.put("/", validUser, async (req, res) => {
  // return photos
  try {
    let expense = await Expense.findOne({
      user: req.user,
      name: req.body.name,
    })
    if(req.body.actual) {
      expense.actual = req.body.actual;
    }
    if(req.body.max) {
      expense.max = req.body.max;
    }
    await expense.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

//edit particular expense!!
router.put("/:id", async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id
    })
    if (req.body.actual) {
      expense.actual = req.body.actual;
    }
    try {
      await expense.save();
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  } catch {
    res.status(404);
    res.send({error: "this user update failed to execute"})
  }
});

//deleting particular expense
router.delete("/:id", async (req, res) => {
  try {
    await Expense.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//delete bucket expense
// router.delete("/", validUser, async (req, res) => {
//   try {
//     await Expense.deleteOne({
//       user: req.user,
//       name: req.body.name,
//     });
//     res.sendStatus(200);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// });

module.exports = {
  model: Expense,
  routes: router,
}
