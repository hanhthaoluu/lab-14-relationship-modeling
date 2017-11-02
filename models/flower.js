'use strict';

const mongoose = require('mongoose');
const Store = require('./store');
const Report = require('./report');


const flowerSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  color: {type: String, default: 'red'},
  orderedDate: {type: Date, default: Date.now},
  store: {type:mongoose.Schema.Types.ObjectId, ref:'store'},
  report: {type:mongoose.Schema.Types.ObjectId, ref:'report'},
});

flowerSchema.pre('findOne', function(done) {
  this.populate({
    path: 'store',
    populate: {
      path: 'flower',
    },
  });
  done();
});


flowerSchema.pre('save', function(done) {
  // {name: 'lilies', store:'Summer Flowers'...}
  //Is it a valid store?
    //Yes...
      //Get the report id from the store
      //Store the store id and the report id on me
      //Add me to the report

  Store.findById(this.store)
    .then(store => {
      if(!store) {
        return Promise.reject();
      } else {
        this.store = store._id;
        this.report = store.report._id;
        return Promise.resolve(this.report);
      }
    })
    .then((report) => {
      Report.findOneAndUpdate(
        {_id:report},
        {$addToSet: {flower:this._id}}
      )
      .then(Promise.resolve())
      .catch(err => Promise.reject(err));
    })
    .then(() => done())
    .catch(done);

    //{_id:'123', name:'lilies', store:"Four Seasons Flowers", roster: "secondHighestDemand"}
    //{_id:'secondHighestDemand', flower:[123]}
});

const Flower = module.exports = mongoose.model('flower', flowerSchema);
