/**
 * Created by Damindu on 5/17/2017.
 */

var carHistory  = require('../models/carParkHistory');

module.exports.findHistory = function (user,date,next) {
    carHistory.findOne({email:user.email,date: {$gte: new Date().getDate()}},function (err,user) {
        if (err) {
            res.send(500, 'showAlert');
        }
        else {
            next(user);
        }
    })
};