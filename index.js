const express = require("express");
const { errorHandler } = require("./middlewares/errorHandler");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 6500;
const flash = require("express-flash");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const passportInit = require("./config/passport.config");
const bcrypt = require("bcrypt");
const UserModel = require("./model/user");
const isLoggedIn = require("./middlewares/isLoggedIn");
const isAuthenticated = require("./middlewares/isAuthenticated");
const override = require("method-override");

passportInit(passport);

mongoose.connect(process.env.DB_URI).then(() => {
  console.log("Connected to db...");
});

app.use(override("_method"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(flash());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    store: new MongoStore({
      collectionName: "sessions",
      mongoUrl: process.env.DB_URI,
    }),
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", isAuthenticated, (req, res) => {
  res.render("index", { name: req.user.name });
});

app.get("/register", isLoggedIn, (req, res) => {
  res.render("register");
});
app.post("/register", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await UserModel.create({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });

    return res.redirect("/login");
  } catch (error) {
    next(error);
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    successRedirect: "/",
  })
);

app.get("/login", isLoggedIn, (req, res) => {
  res.render("login");
});

app.use(errorHandler);

app.delete("/logout", (req, res, next) => {
  req.logOut((error) => {
    if (error) return next(error);
    res.redirect("/login");
  });
});

mongoose.connection.once("open", () => {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
});
