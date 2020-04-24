const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

mongoose.connect('mongodb://localhost:27017/jobs', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const clientSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
});

const Client = mongoose.model('Client', clientSchema);

//gets all clients
app.get('/api/clients', async (req, res) => {
  try {
    let clients = await Client.find();
    res.send(clients);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//creates new client
app.post('/api/clients', async (req, res) => {
  const client = new Client({
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
  });
  try {
    await client.save();
    res.send(client);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//job Schema
const jobSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client'
  },
  name: String,
  price: String,
});

const Job = mongoose.model('Job', jobSchema);

//craetes a pet for the client given the id
app.post("/api/clients/:id/jobs", async (req, res) => {
  // check parameters
  const job = new Job({
    client: req.body.client,
    name: req.body.name,
    price: req.body.price,
  });
  try {
    await job.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

//gets all pets for client gevin id portion of URl
app.get("/api/clients/:id/jobs", async (req, res) => {
  // return pets
  try {
    let jobs = await Job.find({
      client: req.params.client
    })
    return res.send(jobs);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.listen(3005, () => console.log('Server listening on port 3005!'));
