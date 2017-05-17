/**
 * Created by Damindu on 5/17/2017.
 */

var reserve = require('../models/order');

module.exports.findAll = function (next) {
    reserve.find({},function (err,user) {
        if (err) {
            res.send(500, 'showAlert');
        }
        else {
            var length = user.length;
            console.log(length);
            next(length);
        }
    })
};

module.exports.allReserves = function (user,next) {
    reserve.find({email: user.email}, function (err, user) {
        if (err) {
            res.send(500, 'showAlert');
        }
        else {
            var users = [];
            var chunksize = 10;
            for(var i=0;i<user.length;i+=chunksize){
                users.push(user.slice(i,i+chunksize));
            }
            next(users);
        }
    })
};

