const express = require('express');
const h = require('./hello.js');


console.log(h.hello());

const server = express();

server.use((req, res, next) => {
    console.log("Middleware");
    req.testVariable = "Puppua";
    next();
});

server.get('/', (req, res) => {
    res.json({
        hello: h.hello(),
        testVariable: req.testVariable,
    })
});

server.get('*', (req, res) => {
    res.send('ERROR!!!');
});

server.listen(3000, () => {
    console.log('Server started');
})