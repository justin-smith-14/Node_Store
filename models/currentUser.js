/**
 * Created by Justin on 5/4/16.
 */
var mongoose = require('mongoose');

var currentUserSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('CurrentUser', currentUserSchema);