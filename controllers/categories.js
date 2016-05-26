/**
 * Created by Justin on 5/23/16.
 */
var functions = require('../js/functions');
var mongoose = require('mongoose');
var Categories = mongoose.model('KNCategories');
var Users = mongoose.model('KNUsers');
var CurrentUser = mongoose.model('KNCurrentUser');

exports.createOrUpdateCategory = function (req, res) {
    var errors = [];
    var id = req.body.id;

    var valName = functions.validateFirst(req.body.name),
        valSlug = functions.validateLast(req.body.slug);

    if (valName) {
        errors.push(valName);
    }
    if (valSlug) {
        errors.push(valSlug);
    }

    var q = {
        name: req.body.name.toLowerCase(),
        slug: req.body.slug.toLowerCase()
    };

    if (id) {
        q._id = {$ne: id};
    }

    var query = {
        name: req.body.name.toLowerCase(),
        slug: req.body.slug.toLowerCase()
    };

    CurrentUser.findOne({_id: req.cookies.userCookie}, function (err, cUser) {
        if (err) {
            throw err;
        }
        if (cUser) {
            Users.findOne({_id: cUser.userId}, function (err, userInfo) {
                if (err) {
                    throw err;
                }
                Categories.findOne(q, function (err, category) {
                    if (err) {
                        throw err;
                    }
                    if (category) {
                        errors.push({
                            msg: "Category already exists",
                            field: "error"
                        });
                    }
                    Categories.findOne({ _id: id}, function (err, categories) {
                        if (errors.length != 0) {
                            return res.render('views/createCategory', {
                                errors: errors,
                                body: req.body,
                                user: userInfo,
                                category: category,
                                greeting: "Hello "
                            });
                        } else if (!categories) {
                            categories = new Categories(query);
                        } else {
                            for (var i in query) {
                                categories[i] = query[i];
                            }
                        }
                        categories.save();
                        return res.redirect('/dashboard/categories');
                    });
                });
            });
        }
    });
};

exports.fillCategoryTable = function (req, res) {
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
                Categories.count().exec(function (err, count) {
                    var pages = [];
                    var maxPages = Math.ceil(count / perPage);
                    var page = parseInt(req.query.page) - 1 || 0;
                    //console.log('page', page);
                    for (var i = 0; i < maxPages; i++) {
                        pages.push(i);
                    }
                    //console.log('count', count);
                    //console.log('pages', pages);
                    Categories.find().sort({date: -1}).limit(perPage).skip(perPage * page).exec(function (err, categories) {
                        if (err) {
                            throw err;
                        }
                        if (categories) {
                            return res.render('views/categories', {
                                pages: pages,
                                page: page,
                                categories: categories,
                                user: userInfo,
                                greeting: "Hello "
                            });
                        }
                    });
                })
            });
        } else {
            return res.render('views/categories')
        }
    });
};

exports.getCategoryInfo = function (req, res) {
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
                    Categories.findById(id, function (err, category) {
                        //console.log('user: ', user);
                        if (err) {
                            throw err;
                        }
                        return res.render('views/createCategory', {
                            category: category,
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
    var perPage = 3;

    Categories.find().sort({date: -1}).limit(perPage).exec(function (err, categories) {
        if (err) {
            throw err;
        }
        if (categories) {

            Categories.findByIdAndRemove(id, function (err, category) {
                if (err) {
                    throw err;
                }
                if (category) {
                    return res.redirect('/dashboard/categories');
                }
            });
        }
    });
};
