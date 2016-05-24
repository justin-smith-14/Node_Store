/**
 * Created by Justin on 5/4/16.
 */
var mongoose = require('mongoose');

var KNCurrentUserSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId }
});

module.exports = mongoose.model('KNCurrentUser', KNCurrentUserSchema);