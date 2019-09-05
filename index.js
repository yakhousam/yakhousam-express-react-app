const express = require("express");
const path = require('path')
const passport = require('passport');
const session = require('express-session')
// const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash')

const auth = require('./auth')


const app = express();

// const store =  new MongoDBStore({
//   uri: process.env.dbUri,
//   collection:'session'
// })

auth();
app.use(
  session({
    secret: 'kldskfmqkdlsmfqm',
    resave: true,
    saveUninitialized: true,
    // store
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(flash())

const dev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 3001;

app.set('view engine', 'pug');

const restricAccess = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect("/login");
  next();
};
const isLogedIn = (req, res, next) => {
  if (req.isAuthenticated()) return res.redirect("/");
  next();
};

if (dev) {
  const cors = require("cors");
  app.use(cors());
  app.get("/", restricAccess, (req, res) => {
    res.end("<html><body><h1>this is an express server</h1><a href='/logout'>Logout</a></body></html>");
   
  });
} else {
  app.use(express.static(path.join(__dirname , "../build")));
  app.get("/", restricAccess, (req, res) => {
    // res.sendFile(path.join(__dirname , "../build/index.html"));
    res.end("<html><body><h1>this is an express server</h1><a href='/logout'>Logout</a></body></html>");
  });
}
app.get("/api/getuserinfos", restricAccess, (req, res) => {
//   console.log("get stuf route........");
  res.json({ username: req.user.username });
});

app.get("/login", isLogedIn, (req, res) => {
  res.locals.error = req.flash('error');
  res.render(__dirname + '/views/login.pug')
});
app.post("/login",
  passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/',
    failureFlash: true
  })
);
app.get('/logout',isLogedIn, (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log("server is nunning on port:",PORT);
});
