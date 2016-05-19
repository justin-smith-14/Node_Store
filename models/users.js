/**
 * Created by Justin on 4/27/16.
 */
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    firstName: String,
    lastName:  String,
    email:     String,
    role:      String,
    gender:    String,
    age:       Number,
    cell:      Number,
    password:  String,
    date:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('Users', userSchema);
