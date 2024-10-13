var express = require("express");
var router = express.Router();
let userModel = require("../models/user.model");
let authMiddleware = require("../middlewares/auth");
let message = "";
/* GET home page. */

router.get("/", authMiddleware, async function (req, res) {
  console.log("ses", req.session.count);
  console.log("IN IF");
  res.render("index");
  // let productsLength = await productsModel
  //   .find({ is_delete: false }, { _id: 1 })
  //   .lean();
  // let prepaidOrderLength = await orderModel
  //   .find({ is_delete: false, payment: true, type: "Online" }, { _id: 1 })
  //   .lean();
  // let codOrderLength = await orderModel
  //   .find({ is_delete: false, type: "COD" }, { _id: 1 })
  //   .lean();
  // res.render("home", {
  //   productsLength: productsLength.length,
  //   prepaidOrderLength: prepaidOrderLength.length,
  //   codOrderLength: codOrderLength.length,
  // });
});
router.get("/logout", authMiddleware, function (req, res, next) {
  req.session.destroy();
  res.redirect("/admin");
});
router.get("/admin", async function (req, res, next) {
  let check = await userModel.findOne().lean();
  if (!check) {
    userModel.create({
      username: "admin",
      password: "admin123",
      is_admin: true,
    });
  }
  res.render("login", { message: "" });
});
router.post("/admin", async (req, res) => {
  const { username, password } = req.body;
  let check = await userModel
    .findOne({ username: username, password: password, is_admin: true })
    .lean();
  if (check) {
    req.session.count = true;
    res.redirect("/");
  } else {
    res.render("login", { message: "Invalid Data" });
  }
});

module.exports = router;
