'use strict';

//Core Dependencies
require('dotenv').config();
const morgan = require('morgan');
const mongoose = require('mongoose');

//DB connection
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/flowers_dev', {useMongoClient: true});

//App
const app = module.exports = require('express')();
let isON= false;
let http = null;

//Register app wide middleware
//CORS
app.use(cors({origin: process.env.ORIGIN_URL}));

//3rd party middleware
const cors = require('cors');
const morgan = require('morgan');

let http = null;
let isRunning = false;

//LOGGER
app.use(morgan('dev'));

//Register routes
app.use('/api/v1', require(__dirname + '/routes/location-routes'));
app.use('/api/v1', require(__dirname + '/routes/flower-routes'));

//404 Hander
app.use("*", (req, res, next) => {
  res.sendStatus(404);
  next();
});

app.use((err, req, res, next) => {
  console.log(err.error);
  res.status(err.statusCode || 500).send(err.message || 'server error');
});

module.exports => {
  start: (port) => {
    let usePort = port || process.env.PORT;
    if (isRunning) {
      throw Error("Server is already running");
    }
    http = app.listen(usePort, () => {
      isRunning = true;
      console.log("Server is up & running on Port", usePort);
    });
  },

  stop: () => {
    if(! isRunning) {
      throw Error("Server is already off");
    }
    if(! http) {
      throw Error("Invalid Server")
    }

    http.close(() => {
      http = null;
      isRunning = false;
      console.log("Goodbye");
    });
  }
}
