/**
 * Created by Justin on 5/23/16.
 */
var mongoose = require('mongoose');

var KNCategorySchema = new mongoose.Schema({
    name: { type: String, lowercase: true },
    slug: { type: String, lowercase: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('KNCategories', KNCategorySchema);