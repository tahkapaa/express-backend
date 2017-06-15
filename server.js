const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const _ = require('lodash');

// Promise, odotetaan tietokantayhteyden valmistumista
const database = require('./database.js');
database
  .setup()
  .then(() => {
    const data = {}

    const Product = require('./models/Products.js');
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

    server.use((err, req, res, next) => {
        // next(errror) -funktiota kutsuttu jossain
        console.error(err);
        res.sendStatus(500);
    });

    // Palauta kaikki tuotteet ID:N 
    // perusteella järjestettynä
    server.get('/api/v1/products', (req, res, next) => {
        Product
            .find()
            .then((results) => {
                res.json(_.keyBy(results, 'id'));
            })
            .catch((err) => next(err));
    });

    // Luo uusi tuote
    server.post('/api/v1/products', (req, res, next) => {
        const product = req.body;
        Product
            .create(product)
            .then((results) => {
                res.json(results);
            })
            .catch(next);
    });

    // Hae tuote ID:n perusteella
    server.get('/api/v1/products/:productId', (req, res, next) => {
        const productId = req.params.productId;
        
        Product
            .findById(productId)
            .then((results) => {
                res.json(results);
            })
            .catch(next);
    });

    // Tuotteen päivitys ID:n perusteella
    server.put('/api/v1/products/:productId', (req, res, next) => {
        const productId = req.params.productId;

        Product
            .findByIdAndUpdate(productId, req.body, {
                new: true,
                runValidators: true,
            })
            .then((results) => {
                res.json(results);
            })
            .catch(next);
    });

    // Tuotteen poisto ID:n perusteella
    server.delete('/api/v1/products/:productId', (req, res) => {
        const productId = req.params.productId;

        Product
            .findByIdAndRemove(productId)
            .then(() => {
                res.json({id: product.id,});
            })
            .catch(next);
    });

    server.get('*', (req, res) => {
        res.send('ERROR!!!');
    });

    server.listen(3001, () => {
        console.log('Server started');
    })
  })
  .catch((err) => {
    console.error(err);
    process.exit(-1);
  });


