const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = [
  { _id: "1111", username: "yakhousam", password: "123456" },
  { _id: "2222", username: "soufiane", password: "123456" },
  { _id: "3333", username: "femi", password: "123456" },
  { _id: "4444", username: "jidemobell", password: "123456" }
];

passport.use(
  new LocalStrategy(function(username, password, done) {
    const user = User.find(el => el.username === username);
    if (!user) {
      return done(null, false, { message: "Incorrect username." });
    }
    if (password !== user.password) {
      return done(null, false, { message: "Invalid password." });
    }
    return done(null, user);
  })
);

module.exports = function() {
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  passport.deserializeUser(function(id, done) {
    const user = User.find(el => el._id === id);
    if (!user) return done(new Error("user not found"));
    done(null, user);
  });
};
