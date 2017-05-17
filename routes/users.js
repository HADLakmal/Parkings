var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongoose = require('mongoose');

var multer = require('multer');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/parkKing');
var db = mongoose.connection;

//Models
var reg = require('./models/register');
var carpark = require('./models/managers');
var reserve = require('./models/order');
var carParkHistory = require('./models/carParkHistory');
var userHistory = require('./models/userHistory');

//controllers
var carparks = require('./Controller/carparkControl');
var reserves = require('./Controller/reserveController');
var users = require('./Controller/userController');
var userHistories = require('./Controller/userHistoryController');
var parkHistories = require('./Controller/carparkHistoryController');

/* GET home page. */
router.get('/register', function(req, res, next) {
    res.render('register', {
        title: 'Register' });
});

router.get('/direction', ensureAuthenticated ,function(req, res, next) {
    carpark.find(function (err,carparks) {
        var carparksChunk = [];
        var chunksize = 7;
        for(var i=0;i<carparks.length;i+=chunksize){
            carparksChunk.push(carparks.slice(i,i+chunksize));
        }
        res.render('user', { title: req.user.email, parks: carparksChunk});
    });
});

function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');

}
router.post('/register',function (req,res) {
   var password = req.body.password;
   var name = req.body.name;
   var number = req.body.number;
   var address = req.body.address;
   var nic = req.body.nic;
   var email = req.body.email;
   var image = req.body.image;
   //Form validation
    req.checkBody('body','Body field is required');

    var errors = req.validationErrors();

    if(errors){

    }
    else {
        var newUser = new reg();
        newUser.userName = name;
        newUser.address = address;
        newUser.email = email;
        newUser.password = password;
        newUser.nic = nic;
        newUser.number = number;
        newUser.image = image;
        newUser.save(function (err) {
            if(err) {
                console.log("error");
                throw err;
            }
        });
        console.log("Allright");
        res.redirect('/');

    }

});

router.get('/login', function(req, res, next) {
        res.render('login', {
            title: 'login', error:req.query.error });
    }
);

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(username, password, done) {
        carparks.findUser(username,password,function (user) {
            if (!user) {
                users.findUser(username,password,function (user) {
                    if (user) {
                    console.log("customer");
                        return done(null, user);
                    }
                    if (!user) {
                        console.log("incorrect user name");
                        return done(null, false, {message: 'Incorrect username.'});
                    }
                });
            }
            else if(user)
            return done(null, user);
        });
    }
));

passport.serializeUser(function (user,done) {
   done(null,user);
});

passport.deserializeUser(function (user, done) {
    done(null,user);
});

router.post('/login',
    passport.authenticate('local', {failureRedirect: '/users/login?error=Retype your email and password', failureFlash: true }),
    function (req, res) {
        var email = req.body.email;
        var password = req.body.password;

        carparks.findUser(email,password,function (user) {
            if (!user) {
                users.findUser(email,password,function (user) {
                    if(user){
                        var address = user.address;
                        var newuserHistory = new userHistory();
                        newuserHistory.email = email;
                        newuserHistory.address = address;
                        console.log(email+address);
                        newuserHistory.save(function (err) {
                                       if(err) {
                                           console.log("error");
                                           throw err;
                                       }
                                   });
                        res.redirect('/users/customer?name='+email);
                    }

                });
            }
            else if(user){
            var capacity = user.capacity;
            var newhistory = new carParkHistory();
            newhistory.email = email;
            newhistory.capacity = capacity;
            newhistory.fill = "0";
            console.log(email+capacity);
            newhistory.save(function (err) {
                          if(err) {
                              console.log("error");
                              throw err;
                          }
                      });
            res.redirect('/users/carpark?name='+email);
            }

            });
});
function getParks(callback) {
    carpark.distinct("userName",function (err,user) {
        if (err){

        }
        if (user){
            callback(user);
        }

    });
}
router.get('/customer', ensureAuthenticated,function(req, res, next) {

    users.findDetails(req.user,function (user) {
        if(user) {
            reserve.find({userEmail:req.user.email},function (err,reserves) {
                var reservations = [];
                var chunksize = 10;
                for(var i=0;i<reserves.length;i+=chunksize){
                    reservations.push(reserves.slice(i,i+chunksize));
                }
                res.render('customer', { title: req.user.email, reservations: reservations,customer : user});
            });
        }
    });

//        var names = '';
//    getParks(function (parks) {
//        console.log(parks);
//        names = parks;
//        res.render('customer', { title: req.query.name, parks:names});
//    });

});

router.get('/carpark',ensureAuthenticated, function(req, res, next) {
        carparks.findDetail(req.user,function (user) {
                    if (user){
                        reserve.find({parkEmail:req.user.email , accept:"false" },function(err,reserves){
                            var reservations = [];
                            //var lengths = reserves.length;
                            if(err){
                                console.log("error");
                            }
                            else if(!reserves){
                                console.log("Error");
                            }else{
                                parkHistories.findHistory(req.user,new Date().getDate(),
                                    function (history){
                                        if(!history){
                                            console.log("No usr");
                                        }else if(history){

                                            var chunksize = 10;

                                            var length = user.capacity-reserves.length-history.fill;
                                            console.log(length);
                                            for(var i=0;i<reserves.length;i+=chunksize){
                                                reservations.push(reserves.slice(i,i+chunksize));
                                            }
                                            res.render('carpark', { title: req.user.email, reservations: reservations,park : user, reserved: length});
                                        }});


                            }


                        });
                    }
                    else {

                    }


                });

});


router.get('/registerpark', function(req, res, next) {
    res.render('registerpark', { title: "Register Car Park" });
});

router.post('/registerpark',function (req,res) {
    var name = req.body.name;
    var email = req.body.email;
    var address = req.body.address;
    var password = req.body.password;
    var number = req.body.number;
    var nic = req.body.nic;
    var image = req.body.image;
    var price = req.body.price;
    var open = req.body.open;
    var close = req.body.close;
    var capacity = req.body.capacity;

    if(image==null){
        image = "https://img.clipartfest.com/f299c94db4557c59605fcd19d92f5afe_small-car-park-mdpng-car-park-clipart_299-258.png";
    }
    //Form validation
    req.checkBody('body','Body field is required');

    var errors = req.validationErrors();

    if(errors){

    }
    else {
        var newPark = new carpark();
        newPark.userName = name;
        newPark.address = address;
        newPark.email = email;
        newPark.password = password;
        newPark.number = number;
        newPark.nic = nic;
        newPark.image = image;
        newPark.price = price;
        newPark.close = close;
        newPark.open = open;
        newPark.capacity = capacity;
        newPark.save(function (err) {
            if(err) {
                console.log("error");
                throw err;
            }
        });
        res.redirect('/');

    }

});
//Logout
router.get('/logout', function(req, res) {
    req.logout();
    if(req.isAuthenticated()) console.log('wrong');
    res.redirect('/');
});

//Ordering
router.get('/order', function(req, res, next) {
    console.log(req.query.reserve);
    carparks.findPrice(req.query,function (user) {
        res.render('order', { title: req.user.email, price : user.price, parkEmail: user.email});
    })

});

router.post('/order', function(req, res, next) {

    var parkEmail = req.body.parkEmail;
    var userEmail = req.user.email;
    var month = req.body.month;
    var date = req.body.date;
    var startTime = req.body.start;
    var endTime = req.body.end;
    var amount = req.body.amount;
    var accept = "false";

    console.log(startTime+amount);
    //validation
    req.checkBody('body','Body field is required');

        var errors = req.validationErrors();

        if(errors){

        }
        else {
            var reserved = new reserve();
            reserved.parkEmail = parkEmail;
            reserved.userEmail = userEmail;
            reserved.month = month;
            reserved.date = date;
            reserved.startTime = startTime;
            reserved.endTime = endTime;
            reserved.amount = amount;
            reserved.accept = accept;
            reserved.save(function (err) {
                if(err) {
                    console.log(err);
                    throw err;
                }
            });
            res.redirect('/users/direction');

        }

});

//car park edit

router.get('/carparkedit', function(req, res, next) {
    res.render('carparkedit', { title: req.user.email });
});

router.post('/carparkedit', function(req, res, next) {

    var name = req.body.name;
    var number = req.body.number;
    var price = req.body.price;

    console.log(name+number+price);

    carpark.findOneAndUpdate({ email: req.user.email },
      { $set: { number: number,userName : name, price : price } },
      {upsert: true },
      function (err,user){
        if(err){
           console.log("error");
        }else{
            console.log("works");
        }

      }
    );
    res.redirect('/users/carpark');
});

//customer edit

router.get('/useredit', function(req, res, next) {
    res.render('customeredit', { title: req.user.email });
});

router.post('/useredit', function(req, res, next) {

    var name = req.body.name;
    var number = req.body.number;
    var price = req.body.price;

    console.log(name+number+price);

    reg.findOneAndUpdate({ email: req.user.email },
      { $set: { number: number,userName : name, price : price } },
      {upsert: true },
      function (err,user){
        if(err){
           console.log("error");
        }else{
            console.log("works");
        }

      }
    );
    res.redirect('/users/customer');
});

//Car park details view

router.get('/view', function(req, res, next) {
    var email = req.query.email;

    carparks.findView(req.query,function (user) {
        if(!user){
            console.log("wrong1");
        }
        if(user){
            var carparks  = user;
            carParkHistory.findOne({ email: req.query.email , date: {$gte: new Date().getDate()} },
                function (err,user){
                    if(err){
                        console.log("error");
                    }else if(!user){
                        console.log("No usr");
                    }else if(user){
                            var Fill = user.fill;
                            reserves.findAll(function (length) {
                                console.log(length);
                                if(!length){
                                    console.log("wrong4");
                                }
                                if (length){
                                    var all = length;
                                    res.render('view', { title: req.user.email ,park :carparks,fill:Fill, all : all});
                                }
                            });
                        }
                    });
        }
    });





});

//Count the parking size
router.get('/increment', function(req, res, next) {

    parkHistories.findHistory(req.user,new Date().getDate(),
        function (user){if(!user){
                console.log("No usr");
            }else if(user){
                var filled = user.fill+1;
                if(user.fill==user.capacity) filled = user.capacity;
                if(user.fill<0) filled = 0;
                carParkHistory.findOneAndUpdate({ email: req.user.email , date: {$gte: new Date().getDate()} },
                    { $set: { date: new Date(),fill : filled } },
                    {upsert: true },
                    function (err,user){
                        if(err){
                            console.log("error");
                        }else if(!user){
                            console.log("No usr");
                        }else if(user)
                            res.redirect('/users/carpark');
                    }
                );
            }
        }
    );
});

router.get('/decrement', function(req, res, next) {
    parkHistories.findHistory(req.user,new Date().getDate(),
        function (user){
            if(!user){
                console.log("No usr");
            }else if(user){
                var filled = user.fill-1;
                if(user.fill==0) filled = 0;
                carParkHistory.findOneAndUpdate({ email: req.user.email , date: {$gte: new Date().getDate()} },
                    { $set: { date: new Date(),fill : filled } },
                    {upsert: true },
                    function (err,user){
                        if(err){
                            console.log("error");
                        }else if(!user){
                            console.log("No usr");
                        }else if(user)
                            res.redirect('/users/carpark');
                    }
                );
            }
        }
    );
});

//Accept Reservation
router.get('/accept', function(req, res, next) {

    reserve.findOneAndUpdate({ parkEmail:req.user.email,userEmail: req.query.userEmail, accept:"false"},
        { $set: { accept: "true" } },
        {upsert: true },
        function (err,user){
            if(err){
                console.log("error");
            }else if(!user){

            }
            else if(user){
                res.redirect('/users/carpark');
            }

        }
    );
});

module.exports = router;
