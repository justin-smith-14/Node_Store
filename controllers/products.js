/**
 * Created by Justin on 5/23/16.
 */
var functions = require('../js/functions');
var mongoose = require('mongoose');
var Categories = mongoose.model('KNCategories');
var Products = mongoose.model('KNProducts');
var Users = mongoose.model('KNUsers');
var CurrentUser = mongoose.model('KNCurrentUser');

exports.createOrUpdateProduct = function (req, res) {
    var errors = [];
    var catName = [];
    var id = req.body.id;

    var valName = functions.validateFirst(req.body.name),
        valSlug = functions.validateLast(req.body.slug),
        valPrice = functions.validatePrice(req.body.price),
        valQuantity = functions.validateQuantity(req.body.quantity),
        valCategory = functions.validateCategory(req.body.category);

    if (valName) {
        errors.push(valName);
    }
    if (valSlug) {
        errors.push(valSlug);
    }
    if (valPrice) {
        errors.push(valPrice);
    }
    if (valQuantity) {
        errors.push(valQuantity);
    }
    if (valCategory) {
        errors.push(valCategory);
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
        category: req.body.category,
        slug: req.body.slug.toLowerCase(),
        //imageURL: req.body.image.url,
        //imagePath: req.body.image.path,
        quantity: req.body.quantity,
        price: req.body.price,
        discountPrice: req.body.discountPrice,
        attribute: req.body.attribute
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
                //Products.findOne(q, function (err, product) {
                //    if (err) {
                //        throw err;
                //    }
                //    if (product) {
                //        errors.push({
                //            msg: "product already exists",
                //            field: "error"
                //        });
                //    }
                    Categories.find().exec(function (err, categories) {
                        if (err) {throw err;}
                        for (var i = 0; i < categories.length; i++) {
                            catName.push({
                                name: categories[i].name,
                                iD: categories[i]._id
                            });
                        }
                        //console.log('categories', categories);
                    });
                    Products.findOne({ _id: id}, function (err, products) {
                        //console.log('products: ', products);
                        if (errors.length != 0) {
                            return res.render('views/createProduct', {
                                errors: errors,
                                body: req.body,
                                user: userInfo,
                                categories: catName,
                                products: products,
                                greeting: "Hello "
                            });
                        } else if (!products) {
                            //console.log('1');
                            products = new Products(query);
                        } else {
                            //console.log('2');
                            for (var i in query) {
                                products[i] = query[i];
                            }
                        }
                        //console.log('3');
                        products.save(function (err, products) {
                            if (err) {
                                console.log('error: ', err);
                                throw err;
                            }
                        return res.redirect('/dashboard/products');
                        });
                    });
                //});
            });
        }
    });
};

exports.fillProductTable = function (req, res) {
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
                Products.count().exec(function (err, count) {
                    var pages = [];
                    var maxPages = Math.ceil(count / perPage);
                    var page = parseInt(req.query.page) - 1 || 0;
                    //console.log('page', page);
                    for (var i = 0; i < maxPages; i++) {
                        pages.push(i);
                    }
                    //console.log('count', count);
                    //console.log('pages', pages);
                    Products.find().populate('category').sort({date: -1}).limit(perPage).skip(perPage * page).exec(function (err, products) {
                        if (err) {
                            throw err;
                        }
                        if (products) {
                            return res.render('views/products', {
                                pages: pages,
                                page: page,
                                products: products,
                                user: userInfo,
                                greeting: "Hello "
                            });
                        }
                    });
                })
            });
        } else {
            return res.render('views/products')
        }
    });
};

exports.getProductInfo = function (req, res) {
    var catName = [];
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
                    Categories.find().exec(function (err, categories) {
                        if (err) {
                            throw err;
                        }
                        for (var i = 0; i < categories.length; i++) {
                            catName.push({
                                name: categories[i].name,
                                iD: categories[i]._id
                            });
                        }
                        Products.findById(id, function (err, product) {
                            if (err) {
                                throw err;
                            }
                            return res.render('views/createProduct', {
                                product: product,
                                categories: catName,
                                user: userInfo,
                                greeting: "Hello "
                            })
                        });
                    });
                }
            });
        }
    });
};

exports.delete = function (req, res) {
    var id = req.query.id;
    var perPage = 3;

    Products.find().sort({date: -1}).limit(perPage).exec(function (err, products) {
        if (err) {
            throw err;
        }
        if (products) {

            Products.findByIdAndRemove(id, function (err, product) {
                if (err) {
                    throw err;
                }
                if (product) {
                    return res.redirect('/dashboard/products');
                }
            });
        }
    });
};