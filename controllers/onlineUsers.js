/**
 * Created by Justin on 5/9/16.
 */
var functions = require('../js/functions');
var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var CurrentUser = mongoose.model('CurrentUser');


exports.editUserPOST = function (req, res) {
    var errors = [];
    var id = req.body.id;

    var valFirst = functions.validateFirst(req.body.firstName),
        valLast = functions.validateLast(req.body.lastName),
        valEmail = functions.validateEmail(req.body.signupEmail),
        valRole = functions.validateRadio(req.body.role),
        valPass = functions.validatePassword(req.body.signupPassword, req.body.passwordConfirm, req.body.id);


    if (valFirst) {
        errors.push(valFirst);
    }
    if (valLast) {
        errors.push(valLast);
    }
    if (valEmail) {
        errors.push(valEmail);
    }
    if (valRole) {
        errors.push(valRole);
    }
    if (valPass) {
        errors.push(valPass);
    }

    var q = {email: req.body.signupEmail};

    if (id) {
        q._id = {$ne: id};
    }

    if (id) {
        if (req.body.signupPassword.length > 0) {
            var query = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.signupEmail,
                role: req.body.role,
                password: req.body.signupPassword
            };
        } else {
            query = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.signupEmail,
                role: req.body.role
            };
        }
    } else {
        query = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.signupEmail,
            role: req.body.role,
            password: req.body.signupPassword
        };
    }
    CurrentUser.findOne({_id: req.cookies.userCookie}, function (err, cUser) {
        if (err) {
            throw err;
        }
        if (cUser) {
            Users.findOne({_id: cUser.userId}, function (err, userInfo) {
                if (err) {
                    throw err;
                }
                Users.findOne(q, function (err, user) {
                    if (err) {
                        console.log('error: ', err);
                        throw err;
                    }
                    if (user) {
                        errors.push({
                            msg: "Email already exists",
                            field: "emailErr"
                        });
                    }
                    Users.findOne({_id: id}, function (err, users) {
                        if (errors.length != 0) {
                            return res.render('views/createUser', {
                                errors: errors,
                                body: req.body,
                                user: userInfo,
                                greeting: "Hello "
                            });
                        } else if (!users) {
                            users = new Users(query);
                        } else {
                            for (var i in query) {
                                users[i] = query[i];
                            }
                        }
                        users.save();
                        return res.redirect('/dashboard/users');
                    });
                });
            });
        }
    });
};


exports.fillUserTable = function (req, res) {
    var perPage = 3;

    CurrentUser.findOne({_id: req.cookies.userCookie}, function (err, cUser) {
        if (err) {
            throw err;
        }
        if (cUser) {
            Users.findOne({_id: cUser.userId}, function (err, userInfo) {
                if (err) {
                    throw err;
                }
                Users.count({}).exec(function (err, count) {
                    var pages = [];
                    var maxPages = Math.ceil(count / perPage);
                    var page = parseInt(req.query.page) - 1 || 0;
                    //console.log('page', page);
                    for (var i = 0; i < maxPages; i++) {
                        pages.push(i);
                    }
                    //console.log('count', count);
                    //console.log('pages', pages);
                    Users.find({}).sort({date: -1}).limit(perPage).skip(perPage * page).exec(function (err, users) {
                        if (err) {
                            console.log('err:', err);
                        }
                        if (users) {
                            return res.render('views/users', {
                                pages: pages,
                                page: page,
                                users: users,
                                user: userInfo,
                                greeting: "Hello "
                            });
                        }
                    });
                })
            });
        } else {
            return res.render('views/users')
        }
    });
};

exports.editUserGET = function (req, res) {
    CurrentUser.findOne({_id: req.cookies.userCookie}, function (err, cUser) {
        if (err) {
            throw err;
        }
        if (cUser) {
            Users.findOne({_id: cUser.userId}, function (err, userInfo) {
                if (err) {
                    throw err;
                }
                if (userInfo) {
                    var id = req.query.id;
                    //console.log('query: ', req.query);
                    //console.log('queryId: ', id);
                    Users.findById(id, function (err, user) {
                        //console.log('user: ', user);
                        if (err) {
                            console.log('err', err);
                        }
                        return res.render('views/createUser', {
                            userInfo: user,
                            user: userInfo,
                            greeting: "Hello "
                        })
                    });
                }
            });
        }
    });
};

exports.delete = function (req, res) {
    var id = req.query.id;
    var errors = [];
    var perPage = 3;

    CurrentUser.findOne({_id: req.cookies.userCookie}, function (err, cUser) {
        if (err) {
            throw err;
        }
        if (cUser) {
            Users.findOne({_id: cUser.userId}, function (err, userInfo) {
                if (err) {
                    throw err;
                }
                Users.find({}).sort({date: -1}).limit(perPage).exec(function (err, users) {
                    //console.log("users: ", users);
                    if (err) {
                        throw err;
                    }
                    if (users) {
                        Users.count({}).exec(function (err, count) {
                            var pages = [];
                            var maxPages = Math.ceil(count / perPage);
                            var page = parseInt(req.query.page) - 1 || 0;
                            //console.log('page', page);
                            for (var i = 0; i < maxPages; i++) {
                                pages.push(i);
                            }
                            if (cUser.userId == id) {
                                errors.push({
                                    msg: "Cannot delete user that is currently logged in",
                                    field: "error"
                                });
                                return res.render('views/users', {
                                    pages: pages,
                                    page: page,
                                    users: users,
                                    user: userInfo,
                                    greeting: "Hello ",
                                    errors: errors
                                });
                            } else {
                                Users.findByIdAndRemove(id, function (err, user) {
                                    if (err) {
                                        console.log('err: ', err)
                                    }
                                    if (user) {
                                        return res.redirect('/dashboard/users');
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }
    });
};