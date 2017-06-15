const mongoose = require ('mongoose');
const Promise = require ('bluebird');

mongoose.Promise = Promise;

const mongoUri = 'mongodb://127.0.0.1:27017/productsapp2';

function setup() {
    // Tietokannan alustus
    return new Promise((resolve, reject) => {
        mongoose.connect(mongoUri);
        
        mongoose.connection.once('open', () => {
            console.log('mongodb yhteys avattu taas...');
            resolve();
        });

        mongoose.connection.on('error', (err) => {
            reject(err);
        });

    });
}

module.exports = {
    setup: setup,
}