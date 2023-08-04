const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/userSchema");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    async function (req,email, password, done) {
      try {
        const user = await User.findOne({ email: email });

        if (!user || user.password != password) {
          req.flash("error", "Invalid Username/Password");
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        console.log("Error in finding user:", err);
        return done(err);
      }
    }
  )
);

//Serializing a user determines which data of the user object should be stored in the session-cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// deserializeUser() function uses the id to look up the user in the database and retrieve the user object with data.

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    console.log("Error in finding user --> passport");
    return done(err);
  }
});

// check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  // if the user is signed in, then pass on the request to the next function(controller's action)
  if (req.isAuthenticated()) {
    return next();
  }

  // if the user is not signed in
  return res.redirect("/user/signin");
};

// set authenticated user for views
passport.setAuthenticatedUser = async function (req, res, next) {
  if (await req.isAuthenticated()) {
    // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views

    res.locals.user = req.user;
  }

  next();
};
