'use strict';

const mongoose = require('mongoose');
const Report = require('./reports');

const storeSchema = mongoose.Schema({
  name: {type:String, require:true},
  report: {type:mongoose.Schema.Types.ObjectId, ref:'report'}
});

//before we save a store we want to make sure it has a valid report pointer
storeSchema.pre('save', function(done){
  //{name: "May Flowers"}
  //{name: "May Flowers", report: "highestSale"}

  //Check to see if this store has a report
    //if not, create one, obtain its id, and then point to it
    //if it does, great!

  Report.findById(this.report)
    .then(report => {
      if(! report) {
        let newReport = new Report({});
        return newReport.save();
      } else {
        return report;
      }
    })
    .then(report => this.report = report._id)
    .then(() => done())
    .catch(done);

  //{_id: "highestDemand", flowers:[]}
  //{name: "Red Roses", report: "highestDemand"}
});

storeSchema.pre('findOne', function(){
  this.populate({
    path: 'report',
    populate: {
      path: 'flower',
    },
  });
});
