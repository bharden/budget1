const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

mongoose.connect('mongodb://localhost:27017/lights', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: [
    'secretValue'
  ],
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// const clientSchema = new mongoose.Schema({
//   name: String,
//   address: String,
//   phone: String,
// });
//
// const Client = mongoose.model('Client', clientSchema);
//
// //gets all clients
// app.get('/api/clients', async (req, res) => {
//   try {
//     let clients = await Client.find();
//     res.send(clients);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// });
//
// //creates new client
// app.post('/api/clients', async (req, res) => {
//   const client = new Client({
//     name: req.body.name,
//     address: req.body.address,
//     phone: req.body.phone,
//   });
//   try {
//     await client.save();
//     res.send(client);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// });

//job Schema
// const jobSchema = new mongoose.Schema({
//   client: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'User'
//   },
//   name: String,
//   price: String,
// });
//
// const Job = mongoose.model('Job', jobSchema);
//
// //creates a job for the client given the id
// app.post("/api/users/:id/jobs", async (req, res) => {
//   // check parameters
//   const job = new Job({
//     user: req.body.user,
//     name: req.body.name,
//     price: req.body.price,
//   });
//   try {
//     await job.save();
//     return res.sendStatus(200);
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
//   }
// });
//
// //gets all pets for client given id portion of URl
// app.get("/api/users/:id/jobs", async (req, res) => {
//   // return pets
//   try {
//     let jobs = await Job.find().sort({
//       _id: req.params.client.id
//     }).populate('client');
//     return res.send(jobs);
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
//   }
// });

const jobs = require("./jobs.js");
app.use("/api/jobs", jobs.routes);

const users = require("./users.js");
app.use("/api/users", users.routes);

app.listen(3005, () => console.log('Server listening on port 3005!'));
