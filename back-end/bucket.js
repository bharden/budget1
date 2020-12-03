const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();


const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const bucketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  name: String,
  current: String,
  payment: String,
});

bucketSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
});

const Bucket = mongoose.model('Bucket', bucketSchema);

// create Bucket
router.post("/", validUser, async (req, res) => {

  const bucket = new Bucket({
    user: req.user,
    name: req.body.name,
    current: req.body.current,
    payment: req.body.payment,
  });
  try {
    await bucket.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get Bucket for specific user
router.get("/", validUser, async (req, res) => {
  // return photos
  try {
    let bucket = await Bucket.find({
      user: req.user
    }).sort({
      created: -1
    }).populate('user');
    return res.send(bucket);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get all Bucket
// router.get("/all", async (req, res) => {
//   try {
//     let Bucket = await Bucket.find().sort({
//       created: -1
//     }).populate('user');
//     return res.send(Bucket);
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
//   }
// });



//edit particular user!!
router.put("/:id", async (req, res) => {
  try {
    const bucket = await Bucket.findOne({
      _id: req.params.id
    })
    if (req.body.current) {
      bucket.current = req.body.current;
    }
    if(req.body.name) {
      bucket.name = req.body.name;
    }
    if(req.body.payment) {
      bucket.payment = req.body.payment;
    }
    try {
      await bucket.save();
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

//deleting particular Bucket
router.delete("/:id", async (req, res) => {
  try {
    await Bucket.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


module.exports = {
  model: Bucket,
  routes: router,
}
