'use strict';

const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
  flower: [{type:mongoose.Schema.Types.ObjectId, ref:'flower'}],
});

module.exports = mongoose.model('flower', reportSchema);
