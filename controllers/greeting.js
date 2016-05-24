/**
 * Created by Justin on 5/5/16.
 */
var mongoose = require('mongoose');
var Users = mongoose.model('KNUsers');
var CurrentUser = mongoose.model('KNCurrentUser');

exports.indexWelcome = function(req, res){
    CurrentUser.findOne({ _id: req.cookies.userCookie }, function(err, cUser) {
        if (err) { throw err; }
        if (cUser) {
            Users.findOne({ _id: cUser.userId }, function(err, userInfo) {
                if (err) {throw err;}
                if (userInfo) {
                    return res.render('./views/index', {
                        user: userInfo,
                        greeting: "Hello "
                    })
                }
            })
        } else {
            return res.render('./views/index')
        }
    });
};

exports.dashboardWelcome = function(req, res){
    CurrentUser.findOne({ _id: req.cookies.userCookie }, function(err, cUser) {
        if (err) { throw err; }
        if (cUser) {
            Users.findOne({ _id: cUser.userId }, function(err, userInfo) {
                if (err) {throw err;}
                if (userInfo) {
                    return res.render('./views/dashboard', {
                        user: userInfo,
                        greeting: "Hello "
                    })
                }
            })
        } else {
            return res.render('./views/dashboard')
        }
    });
};

exports.usersWelcome = function(req, res){
    CurrentUser.findOne({ _id: req.cookies.userCookie }, function(err, cUser) {
        if (err) { throw err; }
        if (cUser) {
            Users.findOne({ _id: cUser.userId }, function(err, userInfo) {
                if (err) {throw err;}
                if (userInfo) {
                    return res.render('./views/users', {
                        user: userInfo,
                        greeting: "Hello "
                    })
                }
            })
        } else {
            return res.render('./views/users')
        }
    });
};

exports.createUserWelcome = function(req, res){
    CurrentUser.findOne({ _id: req.cookies.userCookie }, function(err, cUser) {
        if (err) { throw err; }
        if (cUser) {
            Users.findOne({ _id: cUser.userId }, function(err, userInfo) {
                if (err) {throw err;}
                if (userInfo) {
                    return res.render('./views/createUser', {
                        user: userInfo,
                        greeting: "Hello "
                    })
                }
            })
        } else {
            return res.render('./views/createUser')
        }
    });
};

exports.profileInfo = function(req, res){
    CurrentUser.findOne({ _id: req.cookies.userCookie }, function(err, cUser) {
        if (err) { throw err; }
        if (cUser) {
            Users.findOne({ _id: cUser.userId }, function(err, userInfo) {
                if (err) {throw err;}
                if (userInfo) {
                    return res.render('./views/profile', {
                        user: userInfo,
                        greeting: "Hello "
                    })
                }
            })
        }
    });
};