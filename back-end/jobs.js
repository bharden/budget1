const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();


const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const jobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  name: String,
  price: String,
  description: String,
  created: {
    type: Date,
    default: Date.now
  },
});

jobSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
});

const Job = mongoose.model('Job', jobSchema);

// create job
router.post("/", validUser, async (req, res) => {

  const job = new Job({
    user: req.user,
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
  });
  try {
    await job.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get jobs for specific user
router.get("/", validUser, async (req, res) => {
  // return photos
  try {
    let jobs = await Job.find({
      user: req.user
    }).sort({
      created: -1
    }).populate('user');
    return res.send(jobs);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get all jobs
router.get("/all", async (req, res) => {
  try {
    let jobs = await Job.find().sort({
      created: -1
    }).populate('user');
    return res.send(jobs);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

//get particular job
router.get("/:id", async (req, res) => {
  // TBD error checking on req.params.id
  try {
    let job = await Job.findOne({
      _id: req.params.id
    }).populate('user');
    return res.send({
      job: job
    });
  } catch(error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

//deleting jobs
router.delete("/:id", async (req, res) => {
  try {
    await Job.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


module.exports = {
  model: Job,
  routes: router,
}
