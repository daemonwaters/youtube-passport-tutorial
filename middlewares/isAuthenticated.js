//checks if user is authenticated and let them continue if so
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
};

module.exports = isAuthenticated;
