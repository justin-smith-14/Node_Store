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
        validateFirst(document.forms["myForm"]["firstName"].value),
        validateLast(document.forms["myForm"]["lastName"].value),
        validateEmail(document.forms["myForm"]["signupEmail"].value),
        validateAge(document.forms["myForm"]["age"].value),
        validateCell(document.forms["myForm"]["number"].value),
        validateRadio(document.forms["myForm"]["gender"].value),
        validatePassword(document.forms["myForm"]["signupPassword"].value,
            document.forms["myForm"]["passwordConfirm"].value)
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

exports.validateFirst = function (name) {
    if (name.length < 1) {
        return {
            msg: "Field Required",
            field: "firstErr"
            //value: name
        };
    }
    return undefined;
};

exports.validateLast = function (name) {
    if (name.length < 1) {
        return {
            msg: "Field Required",
            field: "lastErr"
            //value: name
        };
    }
    return undefined;
};

exports.validateEmail = function (email) {
    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (mailFormat.test(email) == false) {
        return {
            msg: "Invalid email format",
            field: "emailErr"
            //value: email
        };
    }
    return undefined;
};

exports.validateAge = function (age) {
    if (age.length < 1) {
        return {
            msg: "Field Required",
            field: "ageErr"
            //value: age
        };
    }
    return undefined;
};

exports.validateCell = function (number) {
    var cellFormat = /^[\(]?\d{3}[\)]?[\-]?\d{3}[\-]?\d{4}$/;

    if (cellFormat.test(number) == false) {
        return {
            msg: "Invalid phone number",
            field: "cellErr"
            //value: number
        };
    }
    return undefined;
};

exports.validatePassword = function (password, confirm, id) {
    var passFormat = /^(\w{5,20})+$/;

    if (confirm !== password) {
        return {
            msg: "Passwords do not match",
            field: "passwordErr"
            //value: password
        };
    }
    if (!id) {
        if (passFormat.test(password) == false) {
            return {
                msg: "Invalid: either too short or only _ and alphanumerics allowed",
                field: "passwordErr"
                //value: password
            };
        }
    }
    return undefined;
};

function checkRadio(radios) {
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return true;
        }
    }
    return false;
}

exports.validateRadio = function (gender) {
    if (!gender) {
        return {
            msg: "Please select a radio button",
            field: "radioErr"
            //value: gender
        };
    } else {
        return undefined;
    }
};

exports.validatePrice = function (number) {
    var intFormat = /^(\d*[.]?\d{1,2})$/;

    if (intFormat.test(number) == false) {
        return {
            msg: "Invalid price format",
            field: "priceErr"
        };
    }
    return undefined;
};

exports.validateQuantity = function (quantity) {
    if (quantity.length < 1) {
        return {
            msg: "Field Required",
            field: "quantityErr"
        };
    }
    return undefined;
};

exports.validateCategory = function (category) {
    if (category == "--select one--") {
        return {
            msg: "Please select a category",
            field: "categoryErr"
        };
    }
    return undefined;
};
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
    this.setValue = function(name, value, expire) {
        localStorage.setItem(name, JSON.stringify(value));
        if (expire) {
            localStorage.setItem(name + "_expire", expire.getTime());
        }
    };
    this.getValue = function(name) {
        var ex = localStorage.getItem(name + "_expire");

        if (ex && ex < new Date().getTime()) {
            this.deleteValue(name);
            this.deleteValue(name + "_expire");
            return null;
        } else {
            return JSON.parse(localStorage.getItem(name));
        }
    };
    this.deleteValue = function(name) {
        localStorage.removeItem(name);
    }
}