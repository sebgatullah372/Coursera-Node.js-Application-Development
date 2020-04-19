const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';
const dboperations = require('./operations');

MongoClient.connect(url).then((client)=>{
   

   console.log("Connected Successfully");
   const db = client.db(dbname);
   dboperations.insertDocument(db, {"name": "Sandwitch", "description": "Great Sandwitch"}, "dishes")
   .then((result)=>{
      console.log("Data Inserted: \n", result.ops);
      return dboperations.findDocuments(db, "dishes");
   })
   .then((docs)=>{
      console.log("Found Documents: \n", docs);
      
      return dboperations.updateDocument(db, {"name": "Sandwitch"}, {"description":"Updated Great Sandwitch"},"dishes");
   })
   .then ((result)=>{
      console.log("Updated Documents :\n", result.result);

      return dboperations.findDocuments(db, "dishes");
   })
   .then((docs)=>{
      console.log("Found Updated Documents: \n", docs);

      return db.dropCollection("dishes");
   })
   .then ((result) => {
      console.log("Dropped Collection: ", result);
          
      return client.close();
   })
   .catch((err)=>console.log(err));
})
.catch((err)=>console.log(err));
