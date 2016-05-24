/**
 * Created by Justin on 4/25/16.
 */
var users = require('./controllers/users');
var greeting = require('./controllers/greeting');
var onlineUsers = require('./controllers/onlineUsers');
var categories = require('./controllers/categories');

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
    app.get('/dashboard/users', onlineUsers.fillUserTable);

    //CREATE USER
    app.route('/dashboard/createUser')
        .get(onlineUsers.getUserInfo)
        .post(onlineUsers.createOrUpdateUser);

    //CATEGORIES
    app.get('/dashboard/categories', categories.fillCategoryTable);

    //CREATE CATEGORY
    app.route('/dashboard/createCategory')
        .get(categories.getCategoryInfo)
        .post(categories.createOrUpdateCategory);

    //PROFILE
    app.get('/profile', greeting.profileInfo);

    //RANDOM
    app.get('/logout', users.logoutUser);
    app.get('/deleteUser', users.deleteUser);
    app.get('/dashboard/userDelete', onlineUsers.delete);
    app.get('/dashboard/categoryDelete', categories.delete);

};