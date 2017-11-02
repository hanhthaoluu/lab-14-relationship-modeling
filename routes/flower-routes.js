'use strict';

const express = require('express');
const jsonParser = require('body-parser').json();
const Flower = require(__dirname + '/../models/flower');

const flowerRouter = module.exports = express.Router();

flowerRouter.get('/flowers', (req, res, next) => {
  let findObj = req.query || {};
  Flower.find(findObj)
    .then(flowers => res.send(flowers))
    .catch(err => next({error: err}));
});

flowerRouter.get('/flowers/:id', (req, res, next) => {
  Flower.findOne({_id: req.params.id})
    .then(flowers => {
      console.log(`flowers: `, flowers);
      if(flowers === null) {
        next({statusCode: 404});
      } else {
        res.send(flowers);
      }
    })
    .catch(err => {
      next({error: err});
    });
});


//body-parser parse the json body to create req.body
flowerRouter.post('/flowers', jsonParser, (req, res, next) => {
  let newFlower = new Flower(req.body);
  newFlower.save()
    .then(data => res.send(data))
    .catch(err => next({statusCode: 500, message: 'error creating a flower order', error: err}));
});

flowerRouter.put('/flowers/:id', jsonParser, (req, res, next) => {
  delete req.body._id;
  Flower.findOneAndUpdate({_id: req.params.id}, req.body)
    .then(data => res.send('success!'))
    .catch(err => next({error: err}));
});

flowerRouter.patch('/flowers/:id', jsonParser, (req, res, next) => {
  delete req.body._id;
  //$set will only update the provided/supplied fields
  //instead of replacing the entire object
  Flower.findOneAndUpdate({_id: req.params.id}, {$set: req.body})
    .then(data => res.send('success!'))
    .catch(err => next({error: err}));
});

flowerRouter.delete('/flowers/:id', (req, res, next) => {
  Flower.remove({_id: req.params.id})
    .then(data => res.send('The Flower Order Was Successfully Canceled'))
    .catch(err => next({error: err}));
});
