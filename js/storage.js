/**
 * Created by Justin on 4/28/16.
 */
var db = 'ls';
var storage;

if (db == "cookie") {
    storage = new Cookie;
} else {
    storage = new LocalStorage;
}

/* Submission */

function signUpValidate() {
    var errors = [],
        noErrors = [];

    var validate = [
        validateFirst(document.forms["myForm"]["first"].value),
        validateLast(document.forms["myForm"]["last"].value),
        validateEmail(document.forms["myForm"]["signup-email"].value),
        validateAge(document.forms["myForm"]["age"].value),
        validateCell(document.forms["myForm"]["number"].value),
        validateRadio(document.forms["myForm"]["gender"].value),
        validatePassword(document.forms["myForm"]["signup-password"].value,
            document.forms["myForm"]["password-confirm"].value)
    ];

    for (var i = 0; i < validate.length; i++) {
        if (validate[i].msg !== "") {
            errors.push(validate[i]);
        } else {
            noErrors.push(validate[i]);
        }
    }

    for (var j = 0; j < errors.length; j++) {
        errors[j].field.innerHTML = errors[j].msg;
    }

    for (var k = 0; k < noErrors.length; k++) {
        noErrors[k].field.innerHTML = "";
    }

    if (errors.length == 0) {
        var obj = {
            name: noErrors[0].value + "_" + noErrors[1].value,
            email: noErrors[2].value,
            gender: noErrors[5].value,
            age: noErrors[3].value,
            cell: noErrors[4].value,
            password: noErrors[6].value
        };

        if (!storage.getValue('users')) {
            storage.setValue("users", [obj]);
        } else {
            var usersArray = storage.getValue("users");
            usersArray.push(obj);
            storage.setValue("users", usersArray);
        }
        window.location.href = "/login";
    }
    return false;
}

function loginValidate() {
    var validate = logIn(document.forms["login"]["login-email"].value,
        document.forms["login"]["login-password"].value);

    if (validate == "valid") {
        document.getElementById("error").innerHTML = "";
        window.location.href = "/index";
    } else {
        document.getElementById("error").innerHTML = "email/password incorrect or does not exist";
    }
    return false;
}

/* Validation */

function validateFirst(name) {
    if (name.length < 1) {
        return {
            msg: "Field Required",
            field: document.getElementById("first"),
            value: name
        };
    } else {
        return {
            msg: "",
            field: document.getElementById("first"),
            value: name
        };
    }
}

function validateLast(name) {
    if (name.length < 1) {
        return {
            msg: "Field Required",
            field: document.getElementById("last"),
            value: name
        };
    } else {
        return {
            msg: "",
            field: document.getElementById("last"),
            value: name
        };
    }
}

function validateEmail(email) {
    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        value = storage.getValue("users");

    if (value) {
        for (var i = 0; i < value.length; i++) {
            if (value[i].email.toLowerCase() == email.toLowerCase()) {
                JSON.stringify(value);
                return {
                    msg: "Email already exists",
                    field: document.getElementById("email"),
                    value: email
                };
            }
        }
    }

    if (mailFormat.test(email) == false) {
        return {
            msg: "Invalid email format",
            field: document.getElementById("email"),
            value: email
        };
    } else {
        return {
            msg: "",
            field: document.getElementById("email"),
            value: email
        };
    }
}

function validateAge(age) {
    if (age.length < 1) {
        return {
            msg: "Field Required",
            field: document.getElementById("age"),
            value: age
        };
    } else {
        return {
            msg: "",
            field: document.getElementById("age"),
            value: age
        };
    }
}

function validateCell(number) {
    var cellFormat = /^[\(]?\d{3}[\)]?[\-]?\d{3}[\-]?\d{4}$/;

    if (cellFormat.test(number) == false) {
        return {
            msg: "Invalid phone number",
            field: document.getElementById("cell"),
            value: number
        };
    } else {
        return {
            msg: "",
            field: document.getElementById("cell"),
            value: number
        };
    }
}

function validatePassword(password, confirm) {
    var passFormat = /^(\w{5,20})+$/;

    if (passFormat.test(password) == false) {
        return {
            msg: "Invalid: either too short or only _ and alphanumerics allowed",
            field: document.getElementById("password"),
            value: password
        };
    } else if (confirm !== password) {
        return {
            msg: "Passwords do not match",
            field: document.getElementById("password"),
            value: password
        };
    } else {
        return {
            msg: "",
            field: document.getElementById("password"),
            value: password
        };
    }
}

function checkRadio(radios) {
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return true;
        }
    }
    return false;
}

function validateRadio(gender) {
    if (checkRadio(document.getElementsByName("gender"))) {
        return {
            msg: "",
            field: document.getElementById("gender"),
            value: gender
        };
    } else {
        return {
            msg: "Please select a gender",
            field: document.getElementById("gender"),
            value: gender
        };
    }
}

function logIn(email, password) {
    var storageObj = storage.getValue("users");

    if (storageObj) {
        for (var i = 0; i < storageObj.length; i++) {
            if (storageObj[i].email.toLowerCase() == email.toLowerCase() && storageObj[i].password == password) {
                storage.setValue('currentUser', storageObj[i]);
                return "valid"
            }
        }
    }
}

function displayName() {
    if (storage.getValue("currentUser")) {
        var user = storage.getValue("currentUser"),
            name = user.name.split('_');

        document.getElementById("dropbtn").innerHTML = "Hello " + name[0] + " &dtrif;";
        document.getElementById("login").innerHTML = "Profile";
        document.getElementById("login").setAttribute("href", "/profile");
        document.getElementById("signup").innerHTML = "Log Out";
        document.getElementById("signup").setAttribute("href", "/login");
    }
}

function accountInfo() {
    if (storage.getValue("currentUser")) {
        var user = storage.getValue("currentUser"),
            value = user.name.split('_');

        displayName();
        document.getElementById("profile").innerHTML = " " + value[0] + "'s Profile";
        document.getElementById("first").innerHTML = " " + value[0];
        document.getElementById("last").innerHTML = " " + value[1];
        document.getElementById("email").innerHTML = " " + user.email;
        document.getElementById("gender").innerHTML = " " + user.gender;
        document.getElementById("age").innerHTML = " " + user.age;
        document.getElementById("cell").innerHTML = " " + user.cell;
    }
}

function logOut(name) {
    storage.deleteValue(name);
}

function deleteProfile() {
    var cUserObj = storage.getValue("currentUser"),
        storageObj = storage.getValue("users");

    for (var i = 0; i < storageObj.length; i++) {
        if (storageObj[i].email === cUserObj.email) {
            storageObj.splice(i, 1);
        }
    }
    storage.setValue('users', storageObj);
    logOut("currentUser");
    window.location.href = "/login";
}

/* Classes */

function Cookie() {
    this.setValue = function(name, value, expire) {
        var expires = " expires = " + expire;
        document.cookie = name + " = " + JSON.stringify(value) + ";" + expires;
    };
    this.getValue = function(name) {
        var title = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(title) == 0) {
                return JSON.parse(c.substring(title.length, c.length));
            }
        }
    };
    this.deleteValue = function(name) {
        var cookie = this.getValue(name),
            title = name + "=";

        if (cookie) {
            var d = new Date();
            var expires = " expires = " + new Date(d.getTime() + -1 * 24 * 3600 * 1000);
            document.cookie = title + ";" + expires;
        }
    }
}

function LocalStorage() {
    this.setValue = function (name, value, expire) {
        localStorage.setItem(name, JSON.stringify(value));
        if (expire) {
            localStorage.setItem(name + "_expire", expire.getTime());
        }
    };
    this.getValue = function (name) {
        var ex = localStorage.getItem(name + "_expire");

        if (ex && ex < new Date().getTime()) {
            this.deleteValue(name);
            this.deleteValue(name + "_expire");
            return null;
        } else {
            return JSON.parse(localStorage.getItem(name));
        }
    };
    this.deleteValue = function (name) {
        localStorage.removeItem(name);
    }
}

/*value = storage.getValue("users");

if (value) {
    for (var i = 0; i < value.length; i++) {
        if (value[i].email.toLowerCase() == email.toLowerCase()) {
            JSON.stringify(value);
            return {
                msg: "Email already exists",
                field: "emailErr",
                value: email
            };
        }
    }
}*/

//exports.fillTable = function (req, res) {
//    OnlineUsers.findOne({email: req.body.signupEmail}, function (err, users) {
//        if (err) {throw err;}
//        if (!users) {
//            return res.render('views/users', {
//                users2: {
//                    name: users.name,
//                    email: users.email,
//                    role: users.role
//                }
//            });
//        }
//    });
//};


//POST
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

    var query = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.signupEmail,
        role: req.body.role,
        password: req.body.signupPassword
    };
    if (id) {
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
                        // console.log('doc: ', doc);
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
                        //console.log("users: ", users);
                        //console.log("user: ", user);
                    });
                });
                return res.redirect('/dashboard/users');
            });
        }
    });
};


exports.fillTable = function (req, res) {
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
                    var page = parseInt(req.query.page) -1 || 0;
                    console.log('page', page);
                    for (var i = 0; i < maxPages; i++) {
                        pages.push(i);
                    }
                    console.log('count', count);
                    console.log('pages', pages);
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
                    }
                });
            });
        }
    });
};

