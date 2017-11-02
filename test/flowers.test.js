'use strict';

const request = require('superagent');
const Flower = require('../models/flower');
const mongoose = require('mongoose');

process.env.DB_URL = 'mongodb://localhost:27017/flowers_test';
const server = require('../server');
server.listen(3000);

beforeAll(() => {
  return Flower.remove({});
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});

test('it should returns a status code of 404 for unregisterd routes', () => {
  return request
    .get('localhost:3000/api/v1/donkey')
    //superagent throws an exception/terminate and throw error so you have to do .catch
    .catch(res => {
      expect(res.status).toBe(404);
    });
});


test('it should create a flower order', () => {
  return request
    .post('localhost:3000/api/v1/flowers')
    //.send take a js object and converts it into json
    .send({name: "Roses", color: "Red"}) //post body
    .then((res) => {
      res = res.body;
      expect(res.name).toBe('Roses');
      expect(res.color).toBe('Red');
      expect(res.orderedDate).not.toBe(undefined);
      expect(res._id).not.toBe(undefined);
    });
});

test('it should get an array of flowers orders', () => {
  return request
    .get('localhost:3000/api/v1/flowers')
    .then(res => {
      expect(Array.isArray(res.body)).toBe(true);
    });
});

test('it should get a single flowers order', () => {
  (new Flower({name: 'testSingleGet'})).save()
    .then((flower) => {
      return request
        .get('localhost:3000/api/v1/flowers/' + flower._id)
        .then(res => {
          expect(res.body.name).toBe('testSingleGet');
          expect(res.body.color).toBe('red');
          expect(res.body.orderedDate).not.toBe(undefined);
          expect(res.status).toBe(200);
        });
    })
});

test('it should respond with "not found" for valid requests made with an id that was not found', () => {
  return request
    .get('localhost:3000/api/v1/flowers/80fabe3a8f1f9f9c97a0f4d0')
    .catch((res) => {
      expect(res.status).toBe(404);
    });
});

test('it should update with a put', () => {
  return (new Flower({name: 'testingAPut'})).save()
    .then(flower => {
      return request
        .put('localhost:3000/api/v1/flowers/' + flower._id)
        .send({name: 'newname'})
        .then(res => {
          expect(res.text).toBe('success!');
        })
    })
});

test('it should update with a patch', () => {
  return (new Flower({name: 'testingAPatch'})).save()
    .then(flower => {
      return request
        .patch('localhost:3000/api/v1/flowers/' + flower._id)
        .send({name: 'patchANewName'})
        .then(res => {
          expect(res.text).toBe('success!');
        });
    })
});

test('it should be able to cancel a flowers order', () => {
  return (new Flower({name: 'aboutToBeCanceled'})).save()
    .then(flower => {
      return request
        .delete('localhost:3000/api/v1/flowers/' + flower._id)
        .then(res => {
          expect(res.text).toBe('The Flower Order Was Successfully Canceled');
        });
    })
});
