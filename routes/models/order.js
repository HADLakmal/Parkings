/**
 * Created by Damindu on 4/23/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    parkEmail: {type:String, required:true},
    userEmail : {type: String,required:true},
    nowDate: {type : Date , require : true, default : new Date()},
    month : {type:String,required:true},
    date: {type:String, required:true},
    startTime: {type:String, required:true},
    endTime:{type:String, required:true},
    amount:{type:String, required:true},
    accept:{type:String, required:true}
});

module.exports = mongoose.model('reservation',orderSchema);


