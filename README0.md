![CF](https://camo.githubusercontent.com/70edab54bba80edb7493cad3135e9606781cbb6b/687474703a2f2f692e696d6775722e636f6d2f377635415363382e706e67) 13: ORM / Single Resource Mongo and Express API
===


##Instructions

The test for this lab is an integration test, aka acceptance test, testing the api as a whole, instead of unit test, which tests for small pieces of the app.  (Unit test the files in the Lib folder.)

Remember to use a separate database for testing

//install packages
npm i --save express body-parser morgan cors http-errors mongoose mongodb dotenv bluebird
npm i --save-dev jest superagent
//serve up mongodb in another terminal
mongod --dbpath=./db
//run the Tests in another terminal
npm test


show dbs

3 database that you connect to:
1. your development database
2. your test database
3. your production database

https://jest-bot.github.io/jest/docs/api.html#content


## Instructions for setting up and using MongoDB
_google mongo Shell Quick Reference for useful commands to run in your mongo console and to verify that you have data going in and to see where things are going wrong_
1. make a db folder for each of your project: $mkdir db
2. make sure db is in your gitignore, so it's not commited up to github
3. compared to SQL, there is very little setup in Mongodb
4. to run the mongo server or mongo daemon type in the following mongo command into the console
$mongod --dbpath=./db
5. after running the --dbpath=./db, you will see a message at the bottom "waiting for connections on port 27017"
6. to open a mongo console, type in _mongo_
7. show dbs
8. use dbs //should see 'switched to db dbs'
9. db.flowers.find({})
10. to start my server, run this command in another terminal: $ node server.js
11. to create a note, open another terminal and type in this example note:
$ echo '{"name": "Bamboo Garden", "type": "Vegetarian", "city": "Seattle Center"}' | http post localhost:3000/api/notes
_you should see this successful result_
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 101
Content-Type: application/json; charset=utf-8
Date: Sat, 28 Oct 2017 06:20:55 GMT
ETag: W/"65-lNKwufD7eGlpPW8befBt4+gRCVs"
X-Powered-By: Express

`{
    "_id": "59f421c72b61903a60194c9a",
    "city": "Seattle Center",
    "name": "Bamboo Garden",
    "type": "Vegetarian"
}`

`'use strict';

const request = require('superagent');
const Flower = require('../models/flower');
const mongoose = require('mongoose');

process.env.DB_URL = 'mongodb://localhost:27017/flowers_test';
//when we run our server that's when it's connecting to MongoDB, not when we are running server.listen
const server = require('../server');
server.listen(3000);`

//beforeAll work like the tests, allowing you to return a promise
beforeAll(() => {
  //passing in an empty object to remove all flowers orders in my database
  return Flower.remove({});
});

//when testing an array, you can check to see if array is an array, if the array has a length property, if it is an instance of Array

`test('it should get a single flowers order', () => {
  (new Flower({name: 'testSingleGet'})).save()
    .then((flower) => {
      return request
        .get('localhost:3000/api/v1/flowers/' + flower._id)
        .then(res => {
          expect(res.body.name).toBe('testSingleGet');
        });
    })
});`


`test('it should update with a put', () => {
  //create a flower order and apply .save to avoid saving it onto a variable
  return (new Flower({name: 'testingAPut'})).save()
    .then(flower => {
      return request
        .put('localhost:3000/api/v1/flowers/' + flower._id)
        .send({name: 'newname'})
        .then(res => {
          expect(res.text).toBe('success!');
        })
    });
});`


## Submission Instructions
  * fork this repository & create a new branch for your work
  * write all of your code in a directory named `lab-` + `<your name>` **e.g.** `lab-susan`
  * push to your repository
  * submit a pull request to this repository
  * submit a link to your PR in canvas
  * write a question and observation on canvas

## Learning Objectives  
* students will be able to work with the MongoDB database management system
* students will understand the primary concepts of working with a NoSQL database management system
* students will be able to create custom data models *(schemas)* through the use of mongoose.js
* students will be able to use mongoose.js helper methods for interacting with their database persistence layer

## Requirements
#### Configuration
* `package.json`
* `.eslintrc`
* `.gitignore`
* `README.md`
  * your `README.md` should include detailed instructions on how to use your API

#### Feature Tasks
* create an HTTP Server using `express`
* create a resource **model** of your choice that uses `mongoose.Schema` and `mongoose.model`
* use the `body-parser` express middleware to parse the `req` body on `POST` and `PUT` requests
* use the npm `debug` module to log the functions and methods that are being used in your application
* use the express `Router` to create a route for doing **RESTFUL CRUD** operations against your _model_

## Server Endpoints
### `/api/resource-name`
* `POST` request
  * should pass data as stringifed JSON in the body of a post request to create a new resource

### `/api/resource-name/:id`
* `GET` request
  * should pass the id of a resource through the url endpoint to get a resource
    * **this should use `req.params`, not querystring parameters**
* `PUT` request
  * should pass data as stringifed JSON in the body of a put request to update a pre-existing resource
* `DELETE` request
  * should pass the id of a resource though the url endpoint to delete a resource
    * **this should use `req.params`**

### Tests
* create a test that will ensure that your API returns a status code of 404 for routes that have not been registered
* create a series of tests to ensure that your `/api/resource-name` endpoint responds as described for each condition below:
  * `GET` - test 200, returns a resource with a valid body
 * `GET` - test 404, respond with 'not found' for valid requests made with an id that was not found
 * `PUT` - test 200, returns a resource with an updated body
 * `PUT` - test 400, responds with 'bad request' if no request body was provided
 * `PUT` - test 404, responds with 'not found' for valid requests made with an id that was not found
 * `POST` - test 400, responds with 'bad request' if no request body was provided
 * `POST` - test 200, returns a resource for requests made with a valid body

### Bonus
* **2pts:** a `GET` request to `/api/resource-name` should return an array of stored resources
