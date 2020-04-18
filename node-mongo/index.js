const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

MongoClient.connect(url, (err, client)=>{
   assert.equal(err,null);

   console.log("Connected Successfully");
   const db = client.db(dbname);
   const collection = db.collection("dishes");

   collection.insertOne({"name": "Burger", "description": "Delicious"}, (err, result)=>{
     
    assert.equal(err,null);

    console.log("Data Inserted: \n");
    console.log("After Insertion:  \n  ");
    console.log(result.ops);

    collection.find({}).toArray((err,docs)=>{
     assert.equal(err,null);
     console.log("Inserted data : \n");
     console.log(docs);

     db.dropCollection("dishes", (err,result)=>{
      assert.equal(err,null);

      client.close();

     });


    });
    
   });

});
