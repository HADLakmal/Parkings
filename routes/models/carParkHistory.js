var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var parkHistory = new Schema({
    email : {type:String,required:true},
    capacity: {type:Number, required:true},
    fill: {type:Number, required:true},
    date: {type : Date , require : true, default : new Date()}



});

module.exports = mongoose.model('parkHistory',parkHistory);