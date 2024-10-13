require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var session = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var branchRouter = require("./routes/branch");
var subjectRouter = require("./routes/subject");
var linksRouter = require("./routes/static_link");

mongoose.connect(
  process.env.DATABASE_CONNECTION_STRING + process.env.DATABASE_NAME,
  {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  }
);
console.log(
  "runn",
  process.env.DATABASE_CONNECTION_STRING + process.env.DATABASE_NAME
);
mongoose.connection
  .once("open", () => {
    console.log(
      "Well done! , connected with mongoDB database",
      process.env.DATABASE_CONNECTION_STRING + process.env.DATABASE_NAME
    );
  })
  .on("error", (error) => {
    console.log("Oops! database connection error:" + error.message);
  });
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    cookie: { sameSite: true, maxAge: oneDay },
    resave: true,
    secret: process.env.AUTH_KEY,
    activeDuration: oneDay,
    saveUninitialized: true,
  })
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/branch", branchRouter);
app.use("/subject", subjectRouter);
app.use("/links", linksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
