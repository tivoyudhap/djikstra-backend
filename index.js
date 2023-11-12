// var http = require("http");

// var server = http.createServer(function (req, res) {
//     res.end("Hello, response dari nodejs");
// });

// server.listen(8000);

// console.log("server running in port 8000");

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

const fastify = require('fastify')({
    logger: true
});

const path = require('path');

fastify.register(require('./routes'), { prefix: '/v1' });

const start = async() => {
    try {
        await fastify.listen(process.env.PORT || 8000, "localhost");
        // await fastify.listen(process.env.PORT);
        console.log('Server listening on ${fastify.server.address().port}');
    } catch (err) {
        console.log(err);
        process.exit(1)
    }
};

start();