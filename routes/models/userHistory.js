var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userHistory = new Schema({
    email : {type:String,required:true},
    address: {type:String, required:true},
    date: {type : Date , require : true, default : new Date()}



});

module.exports = mongoose.model('userHistory',userHistory);