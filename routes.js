/**
 * Created by Justin on 4/25/16.
 */
var users = require('./controllers/users');
var greeting = require('./controllers/greeting');
var onlineUsers = require('./controllers/onlineUsers');

module.exports = function (app) {

    //HOME
    app.get('/', greeting.indexWelcome);
    app.get('/index', greeting.indexWelcome);
    app.get('./index', greeting.indexWelcome);

    //SIGN UP
    app.route('/signup')
        .get(function (req, res) {
        res.render('./views/signup', {});
    })
        .post(users.signupUser);

    //LOG IN
    app.route('/login')
        .get(function (req, res) {
        res.render('./views/login', {});
    })
        .post(users.loginUser);

    //DASHBOARD
    app.get('/dashboard', greeting.dashboardWelcome);

    //USERS
    //app.get('/dashboard/users', greeting.usersWelcome);
    app.get('/dashboard/users', onlineUsers.fillTable);


    //CREATE USER
    app.route('/dashboard/createUser')
        .get(onlineUsers.editUserGET)
        .post(onlineUsers.editUserPOST);

    //PROFILE
    app.get('/profile', greeting.profileInfo);

    //RANDOM
    app.get('/logout', users.logoutUser);
    app.get('/deleteUser', users.deleteUser);
    app.get('/dashboard/delete', onlineUsers.delete);

};