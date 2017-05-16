/**
 * Created by Damindu on 4/17/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var manager = new Schema({
    userName: {type:String, required:true},
    address: {type:String, required:true},
    image: {type:String, required:true},
    price: {type:String},
    number: {type:Number, required:true},
    nic: {type:Number, required:true},
    email : {type:String,required:true},
    open: {type:String, required:true},
    close : {type:String,required:true},
    capacity : {type:Number,required:true},
    password:{type:String,required:true}

});

module.exports = mongoose.model('carpark',manager);