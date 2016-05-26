/**
 * Created by Justin on 5/23/16.
 */
var mongoose = require('mongoose');

var KNProductSchema = new mongoose.Schema({
    name:          { type: String, lowercase: true },
    category:      { type: mongoose.Schema.Types.ObjectId,
                      ref: 'KNCategories'},
    slug:          { type: String, lowercase: true },
    imageURL:      { type: String },
    imagePath:     { type: String },
    description:   { type: String },
    rating:        { type: Number },
    quantity:      { type: Number },
    price:         { type: Number },
    discountPrice: { type: Number },
    date:          { type: Date, default: Date.now },
    attribute:     { type: Array }
});

module.exports = mongoose.model('KNProducts', KNProductSchema);