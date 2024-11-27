const LocalStrategy = require("passport-local").Strategy;
const UserModel = require("../model/user");
const bcrypt = require("bcrypt");

const passportInit = (passport) => {
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
    return done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    return done(null, await UserModel.findOne({ id: id }));
  });
};

module.exports = passportInit;