/**
 * Created by Damindu on 5/17/2017.
 */

var carpark = require('../models/managers');

module.exports.findPrice = function (query,next) {
    console.log(query.reserve);
    carpark.findOne({email:query.reserve},function (err,user) {
        if (err) {
            res.send(500, 'showAlert');
        }
        else {
            next(user);
        }
    })
};
module.exports.findView = function (query,next) {
    console.log(query.email);
    carpark.findOne({email:query.email},function (err,user) {
        if (err) {
            res.send(500, 'showAlert');
        }
        else {
            next(user);
        }
    })
};

module.exports.findUser = function (username,password,next) {
    carpark.findOne({email: username, password: password}, function (err, user) {
        if (err) {
            res.send(500, 'showAlert');
        }
        else {
            next(user);
        }
    })
};

module.exports.findDetail = function (query,next) {
    carpark.findOne({email:query.email},function (err,user) {
        if (err) {
            res.send(500, 'showAlert');
        }
        else {
            next(user);
        }
    })
};

