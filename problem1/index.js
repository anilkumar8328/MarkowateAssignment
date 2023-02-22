const http = require('http');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/', (req, res) => {
  console.log('Received data:', req.body);

  const people = req.body.people;

  const tableRows = people.map((person) => {
    return `<tr><td>${person.name}</td><td>${person.age}</td></tr>`;
  }).join('');

  const html = `
    <html>
      <head>
        <style>
          table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
            padding: 5px;
          }
        </style>
      </head>
      <body>
        <table>
          <tr><th>Name</th><th>Age</th></tr>
          ${tableRows}
        </table>
      </body>
    </html>
  `;

  res.send(html);
});

const server = http.createServer(app);

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
