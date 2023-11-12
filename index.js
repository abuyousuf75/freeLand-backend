const express = require('express'); 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
 const app = express(); 
const port = process.env.PORT || 5000;
 // middleware 
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
      origin: ['http://localhost:5173'],
      credentials: true,
  }),
)

///new middle ware

const logger = (req,res,next)=>{
  console.log(req)
  console.log('log info',req.method, req.uri2);

  next()
}


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
    // await client.connect();
   
    const allCetogoryJobs = client.db('freeLand').collection('allJobs');
    const usersCollections = client.db('freeLand').collection('user');
    const allBidJobsCollections =  client.db('freeLand').collection('allBid');
    const myPostedJobsCollections = client.db('freeLand').collection('myPostedJobs');
    const subscriberEmailCollections = client.db('freeLand').collection('subscribers');

   // auth related api

   app.post('/jwt',(req,res)=>{

    const user = req.body;
    console.log('user token',user);
    const token = jwt.sign(user, process.env.ACCES_TOKEN_SEC,{expiresIn: '1h'});

    res
    .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    })
    .send({
        sucess : true
    })

   })

   app.post('/logout',async(req,res) =>{
      const user = req.body;
      console.log('lloged in user : ',user)
     res.clearCookie('token',{maxAge: 0}).send({succes: true})
   })



/// for all bid jobs

app.post('/allBid', async(req,res) =>{
  const bids = req.body;
  const result = await allBidJobsCollections.insertOne(bids);
  res.send(result)
})



// Serch by async or dsc order

app.get('/MyBids',async(req,res) =>{
 
  const filter = req.query;
  let query = {};
  if(req.query?.email){
      query = {email : req.query.email}
  }
 const options = {
   sort: {
    bidAmound: filter.sort ==='asc' ? 1 :-1,
   }

 }
 const cursor = allBidJobsCollections.find(query,options)
  const result = await cursor.toArray();
  res.send(result)

})




app.get('/BidRequest', async(req,res) =>{
  let query = {};
  if(req.query?.employerEmail){
      query = {employerEmail : req.query.employerEmail}
  }
  const result = await allBidJobsCollections.find(query).toArray();
  res.send(result)

})



app.patch('/BidRequest/:id', async(req,res) =>{
  const id = req.params.id
  const filter = {_id : new ObjectId(id)}
  const updateBid = req.body;
  const updateDoc = {
    $set:{
      status : updateBid.status
    },
  };
  const result = await allBidJobsCollections.updateOne(filter,updateDoc);
  res.send(result)

})

// update bid request sataus

 ///zkxjLSJKD

 
 app.get('/BidRequest/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)};
  const result = await allBidJobsCollections.findOne(query);
  console.log(result)
  res.send(result)

})



 ///zkxjLSJKD

// get all postedJobs

app.get('/postedJobs', async(req,res) =>{
  const cursor = myPostedJobsCollections.find();
  const result = await cursor.toArray();
  res.send(result)
})

app.get('/myPostedJobs', async(req,res) =>{
  // console.log(req.query.email);
  let query = {};
  if(req.query?.email){
      query = {email : req.query.email}
  }
  const result = await myPostedJobsCollections.find(query).toArray();
  res.send(result)
})

//all jobs bid



// query by categorys
app.get('/allJobs', async(req,res) =>{
  // console.log(req.query.email);
  let query = {};
  if(req.query?.jobcategory){
      query = {jobcategory : req.query.jobcategory}
  }
  const result = await myPostedJobsCollections.find(query).toArray();
  res.send(result)
})




// update Posted Jobs
app.get('/updatePostedJobs', async(req,res) =>{
  const cursor = myPostedJobsCollections.find();
  const result = await cursor.toArray();
  res.send(result)
})

app.put('/updatePostedJobs/:id', async(req,res) =>{
  const id = req.params.id;
  const filter = {_id : new ObjectId(id)};
  const options = {upsert : true};
  const updateJobs = req.body;
  const jobs = {
    $set:{
      email:updateJobs.email ,
      employerEmail:updateJobs.employerEmail,
      jobTitle:updateJobs.jobTitle,
      deadline:updateJobs.deadline ,
      description:updateJobs.description ,
      max_price:updateJobs.max_price ,
     min_price:updateJobs.min_price,
     photo:updateJobs.photo,
     job_category:updateJobs.job_category
    }
  }
  const result = await myPostedJobsCollections.updateOne(filter,jobs,options);
  res.send(result)
})




app.get('/updatePostedJobs/:id', async(req,res) =>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)};
  const result = await myPostedJobsCollections.findOne(query);
  res.send(result)
})

app.delete('/myPostedJobs/:id', async(req,res) =>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)};
    const result = await myPostedJobsCollections.deleteOne(query);
    res.send(result)
})


   app.post('/user',async(req,res) =>{
      const users = req.body;
      const result = await usersCollections.insertOne(users);
      res.send(result)
    })

    //subscriberEmailCollections 

    app.post('/subscriber',async(req,res) =>{
      const subscriber = req.body;
      const result = await subscriberEmailCollections.insertOne(subscriber);
      res.send(result)
    })

    // all category jobs
    app.get('/allJobs/:id', async(req,res) =>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const result = await myPostedJobsCollections.findOne(filter)
      res.send(result)
    })

// post all myPostedJobs

app.post('/postedJobs',async(req,res) =>{
  const postedJobs = req.body;
  const result = await myPostedJobsCollections.insertOne(postedJobs);
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
