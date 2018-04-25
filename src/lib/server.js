'use strict';

const http = require('http');
const cowsay = require('cowsay');
const bodyParser = require('./bodyParser');
const faker = require('faker');
const logger = require('./logger');

const server = module.exports = {};

const app = http.createServer((req, res) => {
  bodyParser(req)
    .then((parsedRequest) => {
      // logger.log(logger.INFO, `Hmm parsedRequest url pathname = ${parsedRequest.method}`);
      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title> cowsay </title>
          </head>
          <body>
           <header>
             <nav>
               <ul>
                 <li><a href="/cowsay">cowsay</a></li>
               </ul>
             </nav>
           <header>
           <main>
             <!-- project description -->
           </main>
          </body>
        </html>
        `);
        res.end();
        return undefined;
      }

      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/cowsay') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        if (!parsedRequest.url.query.text) parsedRequest.url.query.text = faker.name.findName();
        const cowsayText = cowsay.say({ text: parsedRequest.url.query.text });
        res.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title> cowsay </title>
          </head>
          <body>
            <h1> cowsay </h1>
            <pre>
              ${cowsayText}
            </pre>
          </body>
        </html>
        `);
        res.end();
        return undefined;
      }

      if (parsedRequest.method === 'POST' && parsedRequest.url.pathname === '/api/cowsay') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(parsedRequest.body));
        res.end();
        return undefined;
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('PAGE DOES NOT EXIST');
      res.end();
      return undefined;
    })
    .catch((err) => {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.write('BAD REQUEST', err);
      res.end();
      return undefined;
    });
});

server.start = (port, callback) => app.listen(port, callback);
server.stop = callback => app.close(callback);
