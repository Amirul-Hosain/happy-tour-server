const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()
const cors = require('cors')

const app = express();
const port = process.env.PORT || 5000;


//middlewere
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0tkjs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const database = client.db("happyJourny");
    const servicesCollection = database.collection("services");
    const ordersCollection = database.collection("orders")

    // GET API
    app.get('/services', async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.json(services)
    })


    app.get('/orders', async (req, res) => {
      const cursor = ordersCollection.find({});
      const order = await cursor.toArray();
      res.send(order)
    })

    // GET API for manage order
    app.get('/orders/:email', async (req, res) => {
      // const cursor = ordersCollection.find({});
      // const order = await cursor.toArray();
      // res.send(order)
      const orders = await ordersCollection.find({ email: req.params.email }).toArray();
      console.log(orders);
      res.send(orders)
    })

    // POST API for manage order
    app.post('/orders', async (req, res) => {
      const orders = req.body;
      console.log(orders)
      const result = await ordersCollection.insertOne(orders);
      console.log(result);
      res.json(result)
    })

    // POST METHOD
    app.post('/services', async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service)
      res.json(result)
    })

    // DELETE a single Order
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      console.log('deleting a order', result);
      res.json(result)
    })


  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Happy Journy is Running.')
})

app.listen(port, () => {
  console.log('Happy Journy is running at ', port)
})