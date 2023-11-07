const express = require('express'); 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
 const app = express(); 
const port = process.env.PORT || 5000;
 // middleware 
app.use(express.json())
app.use(cors()) 


 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7f8g7nk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const webDevolopemtCollections = client.db('freeLand').collection('WebDevolopment');
    const graphicsDesignCollections = client.db('freeLand').collection('GraphicsDesign');
    const digitalMarketingCollections = client.db('freeLand').collection('DigitalMarketing');
    const usersCollections = client.db('freeLand').collection('user');
    const allBidJobsCollections =  client.db('freeLand').collection('allBid');

    app.get('/webDevolopment', async(req,res) =>{
        const cursor =  webDevolopemtCollections.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    // for webDevolopment specapics jobs
    app.get('/webDevolopment/:id', async(req,res) =>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await webDevolopemtCollections.findOne(query);
        res.send(result)
        
    })

    app.get('/digitalMarketing', async(req,res) =>{
        const cursor = digitalMarketingCollections.find();
        const result = await cursor.toArray();
        res.send(result)
    })

// for DigitalMarketing specapics jobs
app.get('/digitalMarketing/:id', async(req,res) =>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)};
  const result = await digitalMarketingCollections.findOne(query);
  res.send(result)
  
})

    app.get('/graphicsDesigner', async(req,res) =>{
        const cursor = graphicsDesignCollections.find();
        const result = await cursor.toArray();
        res.send(result)
    })
// for graphicsDesigner specapics jobs
app.get('/graphicsDesigner/:id', async(req,res) =>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)};
  const result = await graphicsDesignCollections.findOne(query);
  res.send(result)
  
})




/// for all bid jobs

app.post('/allBid', async(req,res) =>{
  const bids = req.body;
  console.log(bids)
  const result = await allBidJobsCollections.insertOne(bids);
  res.send(result)
})


    app.post('/user',async(req,res) =>{
      const users = req.body;
      console.log(users)
      const result = await usersCollections.insertOne(users);
      res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  
  }
}
run().catch(console.dir);





app.get('/' ,(req, res) =>{ 
    res.send('FreeLand server is running'); 
}) ;

app.listen(port , () =>{ console.log(`port is running on ${port}`) })
