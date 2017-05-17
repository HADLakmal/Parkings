/**
 * Created by Damindu on 5/17/2017.
 */

var users = require('../models/register');


module.exports.findUser = function (username,password,next) {
    users.findOne({email: username, password: password}, function (err, user) {
        if (err) {
            res.send(500, 'showAlert');
        }
        else {
            next(user);
        }
    })
};

module.exports.findDetails = function (user,next) {
    users.findOne({email: user.email}, function (err, user) {
        if (err) {
            res.send(500, 'showAlert');
        }
        else {
            next(user);
        }
    })
};