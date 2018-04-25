'use strict';

const server = require('../lib/server');
const superagent = require('superagent');
const cowsay = require('cowsay');

beforeAll(() => server.start(5000));
afterAll(() => server.stop());

describe('Valid request to the API', () => {
  describe('GET /', () => {
    it('should give a response with a status of 200', () => {
      return superagent.get(':5000/')
        .then((res) => {
          expect(res.status).toEqual(200);
        });
    });
  });

  describe('GET /cowsay', () => {
    const mockCow = cowsay.say({ text: 'Hello, I am a cow!' });
    const mockHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title> cowsay </title>
          </head>
          <body>
            <h1> cowsay </h1>
            <pre>
              ${mockCow}
            </pre>
          </body>
        </html>
        `;
    it('should respond with a status of 200 and return the mock cow html', () => {
      return superagent.get(':5000/cowsay')
        .query({ text: 'Hello, I am a cow!' })
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.text).toEqual(mockHtml);
        });
    });
  });

  describe('POST /api/cowsay', () => {
    it('should return status 200 for a successful post', () => {
      return superagent.post(':5000/api/cowsay')
        .send({ name: 'Carl' })
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.body.name).toEqual('Carl');
        });
    });
  });

  describe('Invalid request to the API', () => {
    describe('GET /cowsay', () => {
      it('should catch err with 400 status code for not sending text in query', () => {
        return superagent.get(':5000/cowsay')
          .query({})
          .then(() => {})
          .catch((err) => {
            expect(err.status).toEqual(400);
            expect(err).toBeTruthy();
          });
      });
    });
  });
});
