const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';

const connect = mongoose.connect(url);

connect.then((db)=>{
    console.log("Connected correctly to the server");
    Dishes.create({
        name: "Pizza",
        description: "Good Pizza"
    })
    .then((dish)=>{
        console.log(dish);

        return Dishes.findByIdAndUpdate(dish._id,{
            $set : {description: 'Updated Pizza'}
        
        },{
            new: true
        }).exec();

    })
    .then((dish)=>{
        console.log(dish);

        dish.comments.push({
            rating: 5,
            comment: 'I\'m getting a sinking feeling!',
            author: 'Arnob'
        });
        return dish.save();

    })
    .then((dishes)=>{
        console.log(dishes);

        return Dishes.remove({});
    
    })
    .then(()=>{
      return mongoose.connection.close();
    })
    .catch((err)=>{
        console.log(err);
    })
});    
