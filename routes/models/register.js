/**
 * Created by Damindu on 4/16/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var regSchema = new Schema({
    userName: {type:String, required:true},
    address: {type:String, required:true},
    number: {type:String, required:true},
    nic: {type:String, required:true},
    image: {type:String, required:true},
    email : {type:String,required:true},
    password:{type:String,required:true}
});

module.exports = mongoose.model('CustomerRegister',regSchema);
