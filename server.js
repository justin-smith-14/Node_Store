/**
 * Created by lamppostgroup on 3/16/16.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var swig = require('swig');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');

//app.use(express.static('public'));
app.use('/views', express.static('views'));
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(function (req, res, next) { // ----CORS to override
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cookieParser());
app.engine('html', swig.renderFile); // set sup view engine
app.set('view engine', 'html');
app.set('views', __dirname + '/');
app.set('view cache', false);
swig.setDefaults({cache: false});
mongoose.connect('mongodb://localhost/test');
mongoose.connection.on('open', function () {
    console.log('Mongoose connected.');
});

require('./routes.js')(app);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});


