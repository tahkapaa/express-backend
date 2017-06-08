const express = require('express');
const h = require('./hello.js');

const bodyParser = require('body-parser');
const cors = require('cors');


const data = {
  '1-basic-hammer': {
    id: '1-basic-hammer',
    title: 'Basic hammer',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.',
    price: 102.29,
    currency: 'EUR'
  },
  '2-fancy-hammer': {
    id: '2-fancy-hammer',
    title: 'Fancy Hammer',
    description: 'Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.',
    price: 183.03,
    currency: 'EUR'
  },
  '3-awesome-hammer': {
    id: '3-awesome-hammer',
    title: 'Awesome Hammer',
    description: 'Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.',
    price: 2039.39,
    currency: 'EUR'
  }
};

console.log(h.hello());

const server = express();

server.use(cors());
server.use(bodyParser.json());

server.use((req, res, next) => {
    console.log("Middleware");
    req.testVariable = "Puppua";
    if (req.cookies != undefined) {
        console.log(req.cookies);
    }
    
    res.cookie('id', 'keksi');
    next();
});

server.get('/', (req, res) => {
    res.json({
        hello: h.hello(),
        testVariable: req.testVariable,
    })
});

// Palauta kaikki tuotteet ID:N 
// perusteella järjestettynä
server.get('/api/v1/products', (req, res) => {
    res.json(data);
    // res.json({
    //    message: 'GET /products', 
    // });
});

// Luo uusi tuote
server.post('/api/v1/products', (req, res) => {
    const product = req.body;
    if (!product || !product.title) {
        res.sendStatus(400);
        return;
    }
    const productId = Math.random();
    product.id = productId;

    data[productId] = product;

    res.json(data[productId]);
    
});

// Hae tuote ID:n perusteella
server.get('/api/v1/products/:productId', (req, res) => {
    const productId = req.params.productId;
    const product = data[productId];

    if(!product) {
        res.sendStatus(404);
        return;
    }

    res.json({
       product, 
    });
});

// Tuotteen päivitys ID:n perusteella
server.put('/api/v1/products/:productId', (req, res) => {
    const productId = req.params.productId;
    const product = data[productId];

    if(!product) {
        res.sendStatus(404);
        return;
    }

    const newProduct = req.body;
    if (!newProduct || !newProduct.title) {
        res.sendStatus(400);
        return;
    }

    if (newProduct.id != product.id) {
        res.sendStatus(400);
        return;
    }

    data[productId] = Object.assign({}, product, {
        title: newProduct.title,
        price: newProduct.price,
        description: req.body.description,
        currency: req.body.currency,
    });
    
    res.json(data[productId]);
});

// Tuotteen poisto ID:n perusteella
server.delete('/api/v1/products/:productId', (req, res) => {
    const productId = req.params.productId;
    const product = data[productId];

    if(!product) {
        res.sendStatus(404);
        return;
    }
    delete data[productId];

    res.json({
       id: productId, 
    });
});

server.get('*', (req, res) => {
    res.send('ERROR!!!');
});

server.listen(3001, () => {
    console.log('Server started');
})