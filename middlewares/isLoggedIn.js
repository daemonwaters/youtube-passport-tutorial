//simlar to last middleware but if user is authenticated
//they are not going to be able to acces certain pages like login so they're redicrected
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }

  next();
};

module.exports = isLoggedIn;
