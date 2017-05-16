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
        carpark.findOne({email: username, password: password}, function (err, user) {
            if (err) {
                console.log("error");
                return done(err);
            }
            if (!user) {
                reg.findOne({email: username, password: password}, function (err, user) {
                    if (err) {

                    }
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

        carpark.findOne({email:email, password:password},function (err,user) {
            if (err){

            }
            if(!user){
                reg.findOne({email:email, password:password},function (err,user) {
                    if (err){

                    }
                    if(user){

                        res.redirect('/users/customer?name='+email);
                    }

                });
            }
            else if(user)
                res.redirect('/users/carpark?name='+email);
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

    reserve.find({userEmail:req.user.email},function (err,reserves) {
            var reservations = [];
            var chunksize = 10;
            for(var i=0;i<reserves.length;i+=chunksize){
                reservations.push(reserves.slice(i,i+chunksize));
            }
            res.render('customer', { title: req.user.email, reservations: reservations});
        });
//        var names = '';
//    getParks(function (parks) {
//        console.log(parks);
//        names = parks;
//        res.render('customer', { title: req.query.name, parks:names});
//    });

});

router.get('/carpark',ensureAuthenticated, function(req, res, next) {
        reserve.find({parkEmail:req.user.email , accept:"false"},function (err,reserves) {
                    var reservations = [];
                    var chunksize = 10;
                    for(var i=0;i<reserves.length;i+=chunksize){
                        reservations.push(reserves.slice(i,i+chunksize));
                    }

                    res.render('carpark', { title: req.user.email, reservations: reservations});
                });
//    carpark.findOne({email:req.query.name},function (err,user) {
//        if (err) {
//            res.send(500, 'showAlert');
//        }
//        res.render('carpark', { title:user.userName ,park : user });
//    });

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

    //check for image field
//    if(req.files.image){
//        console.log("upload file");
//        //File info
//        var imageOriginalName = req.files.image.originalname;
//        image = req.files.image.name;
//        var imageMime = req.files.image.mimetype;
//        var imagePath = req.files.image.path;
//        var imageExt = req.files.image.extension;
//        var imageSize = req.files.image.size;
//    }
//    else {
//        image = 'my.png';
//    }

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
    carpark.findOne({email:req.query.reserve},function (err,user) {
            if (err) {
                res.send(500, 'showAlert');
            }
            res.render('order', { title: req.user.email, price : user.price, parkEmail: user.email});
        });

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

module.exports = router;
