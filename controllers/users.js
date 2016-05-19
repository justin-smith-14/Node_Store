/**
 * Created by Justin on 4/27/16.
 */
var models = require('../models/users');
var currentModel = require('../models/currentUser');
var functions = require('../js/functions');
var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var CurrentUser = mongoose.model('CurrentUser');


exports.signupUser = function (req, res) {
    var errors = [];

    var valFirst = functions.validateFirst(req.body.firstName),
        valLast = functions.validateLast(req.body.lastName),
        valEmail = functions.validateEmail(req.body.signupEmail),
        valGender = functions.validateRadio(req.body.gender),
        valAge = functions.validateAge(req.body.age),
        valCell = functions.validateCell(req.body.number),
        valPass = functions.validatePassword(req.body.signupPassword, req.body.passwordConfirm);

    if (valFirst) {
        errors.push(valFirst);
    }
    if (valLast) {
        errors.push(valLast);
    }
    if (valEmail) {
        errors.push(valEmail);
    }
    if (valGender) {
        errors.push(valGender);
    }
    if (valAge) {
        errors.push(valAge);
    }
    if (valCell) {
        errors.push(valCell);
    }
    if (valPass) {
        errors.push(valPass);
    }

    Users.findOne({email: req.body.signupEmail}, function (err, user) {
        if (err) {
            throw err;
        }
        if (user) {
            errors.push({
                msg: "Email already exists",
                field: "emailErr"
            });
        }

        if (errors.length != 0) {
            return res.render('views/signup', {
                errors: errors,
                body: req.body
            });
        } else {
            var users = new Users({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.signupEmail,
                role: "",
                gender: req.body.gender,
                age: req.body.age,
                cell: req.body.number,
                password: req.body.signupPassword
            });
            users.save();
            return res.redirect('/login');
        }
    });
};

exports.loginUser = function (req, res) {
    var errors = [];

    if (req.body.loginEmail.length == 0 || req.body.loginPassword.length == 0) {
        errors.push({
            msg: "Both fields required",
            field: "error"
        });
        return res.render('views/login', {
            errors: errors,
            body: req.body
        });
    } else {
        Users.findOne({email: req.body.loginEmail.toLowerCase()}, function (err, user) {
            if (err) {
                throw err;
            }
            if (user == null) {
                errors.push({
                    msg: "User does not exist",
                    field: "error"
                });
            } else {
                if (user.password !== req.body.loginPassword) {
                    errors.push({
                        msg: "Email/password incorrect",
                        field: "error"
                    });
                }
            }
            if (errors.length != 0) {
                return res.render('views/login', {
                    errors: errors,
                    body: req.body
                });
            } else {
                var currentUser = new CurrentUser({
                    userId: user._id
                });
                currentUser.save(function (err, currentUser) {
                    if (err) { throw err; }
                    if (currentUser) {
                        res.cookie("userCookie", currentUser._id);
                        return res.redirect('/');
                    }
                });
            }
        });
    }
};

exports.logoutUser = function (req, res) {
    var user = req.cookies.userCookie;

    CurrentUser.findOneAndRemove({ _id: user }, function (err, cUser) {
        if (err) { throw err; }
        if (cUser) {
            res.clearCookie('userCookie');
            return res.redirect('/login');
        }
    })
};

exports.deleteUser = function (req, res) {
    var user = req.cookies.userCookie;

    CurrentUser.findOneAndRemove({ _id: user }, function (err, cUser) {
        if (err) { throw err; }
        if (cUser) {
            Users.findOneAndRemove({ _id: cUser.userId }, function (err, account) {
                if (err) { throw err; }
                if (account) {
                    res.clearCookie("userCookie");
                    return res.redirect('/login');
                }
            })
        }
    })
};


