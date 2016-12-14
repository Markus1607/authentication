var express       = require("express"),
    mongoose      =  require("mongoose"),
    passport      =  require("passport"),
    bodyParser    =  require("body-parser"),
    User          = require("./models/user"),
    LocalStrategy  = require("passport-local").Strategy,
    passportLocalMongoose =  require("passport-local-mongoose");



//CONNECT TO DATABASE
mongoose.connect("mongodb://localhost/auth-demo");




//use
var app = express();
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
  secret: "Mark is the best guy in the world",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


//Responsible for reading the session and taking the data that is encoded, unencode it , use it and decode it late on.
passport.serializeUser(function(User, done) {
  done(null, User.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



//======================
//ROUTES
//======================




//Home
app.get("/", function(req, res){
  res.render("home");
})


//secret
app.get("/secret", function(req, res){
  res.render("secret");
})

//Auth ROUTE


//sign-up form
app.get("/register", function(req, res){
  res.render("register");
})

app.post("/register", function(req, res){
  //AUTHENTICATION LOGIC
  User.register(new User({
    username: req.body.username
  }), req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/secret");
    })
  })

})


//PORT
app.listen(3000, function(){
  console.log("listening on port 3000");
})
