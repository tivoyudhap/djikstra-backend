var http = require("http");

var server = http.createServer(function (req, res) {
    res.end("Hello, response dari nodejs");
});

server.listen(8000);

console.log("server running in port 8000");

// const express = require('express');
// const fs = require('fs');
// const reader = require('./helper/reader')

// const app = express();
// const port = 3000;

// app.get('/data', (req, res) => {
//   // Read the JSON data from the file
//   reader.readJsonFileAsString('data/routes.json', (err, jsonData) => {
//     if (err) {
//       res.status(500).json({ error: 'Unable to read data' });
//       return;
//     }

//     res.send(jsonData);
//   });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });