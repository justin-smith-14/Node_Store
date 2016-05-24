/**
 * Created by Justin on 4/27/16.
 */
var mongoose = require('mongoose');

var KNUserSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName:  { type: String },
    email:     { type: String },
    role:      { type: String },
    gender:    { type: String },
    age:       { type: Number },
    cell:      { type: Number },
    password:  { type: String },
    date:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('KNUsers', KNUserSchema);
