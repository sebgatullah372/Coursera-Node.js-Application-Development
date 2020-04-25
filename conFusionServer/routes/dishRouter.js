const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');

const dishRouter = express.Router();

dishRouter.use(bodyparser.json());

dishRouter.route('/')
.get((req,res,next) => {
    Dishes.find({})
    .populate('comments.author')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req,res, next)=>{
    Dishes.create(req.body)
    .then((dishes)=>{
       console.log('Dish Created', dishes);
       res.statusCode = 200;
       res.setHeader('Content-type', 'application/json');
       res.json(dishes);
    }, (err)=> next(err))
    .catch((err)=>next(err));
 })
 .put(authenticate.verifyUser, (req,res, next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
 })
 .delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.remove({})
    .then((resp)=>{
      res.statusCode = 200;
      res.setHeader('Content-type', 'application/json');
      res.json(resp);
   }, (err)=> next(err))
   .catch((err)=>next(err));
});

dishRouter.route('/:dishId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
 .post(authenticate.verifyUser, (req,res, next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+req.params.dishId);
  })
 .put(authenticate.verifyUser, (req,res, next)=>{
     Dishes.findByIdAndUpdate(req.params.dishId,{$set: req.body},{new:true})
     .then((dishes)=>{
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json(dishes)
     },(err)=>next(err))
     .catch((err)=>next(err));
  })
 .delete(authenticate.verifyUser, (req, res, next) => {
   Dishes.findByIdAndRemove(req.params.dishId)
   .then((resp)=>{
     res.statusCode = 200;
     res.setHeader('Content-type', 'application/json');
     res.json(resp);
  }, (err)=> next(err))
  .catch((err)=>next(err));
 });




 dishRouter.route('/:dishId/comments')
 .get((req,res,next) => {
     Dishes.findById(req.params.dishId)
     .populate('comments.author')
     .then((dish) => {
         if (dish != null) {
             res.statusCode = 200;
             res.setHeader('Content-Type', 'application/json');
             res.json(dish.comments);
         }
         else {
             err = new Error('Dish ' + req.params.dishId + ' not found');
             err.status = 404;
             return next(err);
         }
     }, (err) => next(err))
     .catch((err) => next(err));
 })
 .post(authenticate.verifyUser, (req,res, next)=>{
    Dishes.findById(req.params.dishId)
     .then((dishes)=>{
        if(dishes != null){
           req.body.author = req.user._id;
           dishes.comments.push(req.body)
           dishes.save()
           .then((dishes)=>{
            Dishes.findById(dishes._id)
            .populate('comments.author')
            .then((dishes)=>{
               res.statusCode = 200;
               res.setHeader('Content-type', 'application/json');
               res.json(dishes);
            })  
            
           })
        }
        else {
         err = new Error('Dish ' + req.params.dishId + ' not found');
         err.status = 404;
         return next(err);
      }
        
     }, (err)=> next(err))
     .catch((err)=>next(err));
  })
  .put(authenticate.verifyUser, (req,res, next)=>{
     res.statusCode = 403;
     res.end('PUT operation not supported on /dishes/'
        + req.params.dishId + '/comments');
  })
  .delete((req, res, next) => {
   Dishes.findById(req.params.dishId)
     .then((dishes)=>{
        if(dishes != null){
         for (var i = (dish.comments.length -1); i >= 0; i--) {
            dish.comments.id(dish.comments[i]._id).remove();
        }
        dishes.save()
        .then((dishes)=>{
         res.statusCode = 200;
         res.setHeader('Content-type', 'application/json');
         res.json(dishes); 
        })
        }
        else {
         err = new Error('Dish ' + req.params.dishId + ' not found');
         err.status = 404;
         return next(err);
     } 

       
    }, (err)=> next(err))
    .catch((err)=>next(err));
 });
 
 dishRouter.route('/:dishId/comments/:commentId')
 .get((req,res, next)=>{
   Dishes.findById(req.params.dishId)
   .populate('comments.author')
   .then((dishes)=>{
      if(dishes != null && dishes.comments.id(req.params.commentId)!=null){
      res.statusCode = 200;
      res.setHeader('Content-type', 'application/json');
      res.json(dishes.comments.id(req.params.commentId));
      }
      else if(dishes == null){
        err = new Error('Dish ' + req.params.dishId + ' not found');
        err.status = 404;
        return next(err);
      }
      else{
        err = new Error('Dish ' + req.params.dishId + ' not found');
        err.status = 404;
        return next(err);
      }
   }, (err)=> next(err))
   .catch((err)=>next(err));
  })
  .post(authenticate.verifyUser, (req,res, next)=>{
     res.statusCode = 403;
     res.end('POST operation not supported on /dishes/'+ req.params.dishId
     + '/comments/' + req.params.commentId);
   })
  .put(authenticate.verifyUser, (req,res, next)=>{
   Dishes.findById(req.params.dishId)
      .then((dishes)=>{
         if(dishes != null && dishes.comments.id(req.params.commentId)!=null){
            if(req.body.rating){
               dishes.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if(req.body.comment){
               dishes.comments.id(req.params.commentId).comment = req.body.comment;
            }

            
           dishes.save()
          .then((dishes)=>{
            Dishes.findById(dishes._id)
            .populate('comments.author')
            .then((dishes)=>{
               res.statusCode = 200;
               res.setHeader('Content-type', 'application/json');
               res.json(dishes); 
            }) 
           
          }, (err)=>next(err));
         }
            else if(dishes == null){
              err = new Error('Dish ' + req.params.dishId + ' not found');
              err.status = 404;
              return next(err);
            }
            else{
              err = new Error('Dish ' + req.params.dishId + ' not found');
              err.status = 404;
              return next(err);
            }
      },(err)=>next(err))
      .catch((err)=>next(err));
   })
  .delete(authenticate.verifyUser, (req, res, next) => {
   Dishes.findById(req.params.dishId)
   .then((dishes)=>{
      if(dishes != null && dishes.comments.id(req.params.commentId)!=null){
        dishes.comments.id(req.params.commentId).remove();   
        dishes.save()
        .then((dishes)=>{
         Dishes.findById(dishes._id)
         .populate('comments.author')
         .then((dishes)=>{
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(dishes); 
         }) 
        
       }, (err)=>next(err));
      }
         else if(dishes == null){
           err = new Error('Dish ' + req.params.dishId + ' not found');
           err.status = 404;
           return next(err);
         }
         else{
           err = new Error('Dish ' + req.params.dishId + ' not found');
           err.status = 404;
           return next(err);
         }
   },(err)=>next(err))
   .catch((err)=>next(err));
}); 
module.exports = dishRouter;