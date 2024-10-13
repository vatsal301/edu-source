var express = require("express");
var router = express.Router();
let branchModel = require("../models/branch.model");
let authMiddleware = require("../middlewares/auth");
let messageCreate = "";
let messageView = "";
let messageEdit = "";

/* GET users listing. */
router.get("/create", authMiddleware, function (req, res, next) {
  //   res.send('respond with a resource');
  res.render("Branch/create", { messageCreate: messageCreate });
  messageCreate = "";
});
router.post("/create", authMiddleware, function (req, res, next) {
  //   res.send('respond with a resource');
  let { name, course_year, status } = req.body;
  if (name && status && course_year) {
    branchModel
      .create({
        name: name.toUpperCase(),
        course_year: course_year,
        status: status == "Active" ? true : false,
      })
      .then((data) => { 
        if (data) {
          messageView = "Branch is Created";
          res.redirect("/branch/view");
        }
      })
      .catch((error) => {
        messageCreate = error;
        console.log("error", error);
        res.redirect("/branch/create");
      });
  } else {
    messageCreate = "Enter Branch Name";
    res.redirect("/branch/create");
  }
});
router.get("/view", authMiddleware, async function (req, res, next) {
  //   res.send('respond with a resource');
  let branchs = await branchModel.find();
  res.render("Branch/view", { messageView: messageView, branchs: branchs });
  messageView = "";
});
router.get("/delete/:id", authMiddleware, async function (req, res) {
  console.log("req.params.id", req.params.id);
  branchModel
    .deleteOne({ _id: req.params.id })
    .then((data) => {
      if (data) {
        messageView = "Branch Deleted";
        res.redirect("/branch/view");
      }
    })
    .catch((error) => {
      console.log("error", error);
      messageView = error.message();
      res.redirect("/branch/view");
    });
});
router.get("/edit/:id", authMiddleware, async function (req, res, next) {
  //   res.send('respond with a resource');
  let branchs = await branchModel.findOne({ _id: req.params.id });
  res.render("Branch/edit", { messageEdit: messageEdit, branchs: branchs });
  messageEdit = "";
});
router.post("/edit", authMiddleware, function (req, res, next) {
  //   res.send('respond with a resource');
  let { name, status, _id, course_year} = req.body;
  if (name && status && course_year) {
    branchModel
      .updateOne({ _id: _id }, { name: name, course_year: course_year, status: status == "Active" ? true : false })
      .then((data) => {
        if (data) {
          messageView = "Branch is Edited";
          res.redirect("/branch/view");
        }
      })
      .catch((error) => {
        messageEdit = error;
        console.log("error", error);
        res.redirect("/branch/edit");
      });
  } else {
    messageEdit = "Enter Branch Name";
    res.redirect("/branch/edit");
  }
});
module.exports = router;
