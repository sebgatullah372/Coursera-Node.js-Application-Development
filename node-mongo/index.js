const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';
const dboperations = require('./operations');

MongoClient.connect(url, (err, client)=>{
   assert.equal(err,null);

   console.log("Connected Successfully");
   const db = client.db(dbname);
   dboperations.insertDocument(db, {"name": "Sandwitch", "description": "Great Sandwitch"}, "dishes", (result)=>{
      console.log("Data Inserted: \n", result.ops);
   dboperations.findDocuments(db, "dishes", (docs)=>{
      console.log("Found Documents: \n", docs);
      
    dboperations.updateDocument(db, {"name": "Sandwitch"}, {"description":"Updated Great Sandwitch"},"dishes",(result)=>{
      console.log("Updated Documents :\n", result.result);

      dboperations.findDocuments(db, "dishes", (docs)=>{
        console.log("Found Updated Documents: \n", docs);

        db.dropCollection("dishes", (result) => {
            console.log("Dropped Collection: ", result);

            client.close();
              });

           });

        });  
     });

});   

});
