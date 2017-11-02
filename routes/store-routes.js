'use strict';

const express = require('express');
const jsonParser= require('body-parser').json();
const Store = require(__dirname + '/../models/store');

const storeRouter = module.exports = express.Router();

storeRouter.post('/stores', jsonParser, (req, res, next) => {
  let newStore = new Store(req.body);
  newStore.save()
    .then(store => res.send(store))
    .catch(err => next(err));
});

storeRouter.delete('/stores/:id', (req, res, next) => {
  let storeId = req.params.id;
  Store.remove({_id:storeId})
    .then(() => res.send('Store Closed'))
    .catch({statusCode:500,message:'I don\'t know what is the error'});
});

storeRouter.get('/stores', (req, res, next) => {
  Store.find({})
    .then(stores => res.send(stores))
    .catch(next);
});

storeRouter.get('/stores/:id', (req, res, next) => {
  let storeId = req.params.id;
  Store.findOne({_id:storeId})
    .then(stores => {
      if(stores === null) {
        next({statusCode: 404});
      } else {
        res.send(stores);
      }
    })
    .catch(err => {
      next({error: err});
    });
});
