const LocalStrategy = require("passport-local").Strategy;
const UserModel = require("../model/user");
const bcrypt = require("bcrypt");

const passportInit = (passport) => {
  //this fn is going to run first
  const verifyFn = async (email, password, done) => {
    try {
      const userToBeFound = await UserModel.findOne({ email: email });

      if (!userToBeFound) {
        return done(null, false, { message: "404 - User not found" });
      }

      const isMatch = await bcrypt.compare(password, userToBeFound.password);

      if (!isMatch) {
        return done(null, false, { message: "Credentials dont match" });
      }
      //the user we pass to done fn is going to serialize and deserialize fns
      return done(null, userToBeFound);
    } catch (error) {
      done(error);
    }
  };

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      verifyFn
    )
  );

  passport.serializeUser((user, done) => {
    //its going to serialize user data and put it in a cookie for future useage
    //its going to run after verify function
    return done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    //its going to deserialize the user data from the cookie and authenticate us
    //when we visit other part of the web page
    //remember http is stateless
    //this is going to run after serialize and everytime we try to access data that needs authentication
    return done(null, await UserModel.findOne({ id: id }));
  });
};

module.exports = passportInit;
