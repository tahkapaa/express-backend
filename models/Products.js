const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;

const productSchema = new mongoose.Schema({
    title: { type: Types.String, required: true },
    price: Types.Number,
    description: Types.String,
    currency: Types.String,
});

productSchema.set('toJSON', {
    virtuals: true,
});

// Kokoelman nimeks: Product -> products
const model = mongoose.model('Product', productSchema);

module.exports = model;