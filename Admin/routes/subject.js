var express = require("express");
var router = express.Router();
let branchModel = require("../models/branch.model");
let subjectModel = require("../models/subject.model");
let authMiddleware = require("../middlewares/auth");
let messageCreate = "";
let messageView = "";
let messageEdit = "";

/* GET users listing. */
router.get("/create", authMiddleware, async function (req, res, next) {
  //   res.send('respond with a resource');
  let branch = await branchModel.find({ status: true });
  res.render("Subject/create", {
    branch: branch,
    messageCreate: messageCreate,
  });
  messageCreate = "";
});
router.post("/sem", authMiddleware, async (req, res) => {
  let { branch_id } = req.body;
  if (branch_id) {
    let branch = await branchModel.findOne(
      { _id: branch_id },
      { course_year: 1 }
    );
    res.json({ totalSem: branch.course_year * 2 });
  } else {
    res.json({ totalSem: 0 });
  }
});
router.post("/create", authMiddleware, function (req, res, next) {
  //   res.send('respond with a resource');
  let { name, branch_id, sem, status } = req.body;
  if (name && status && branch_id != "false" && sem != "false") {
    subjectModel
      .create({
        name: name.toUpperCase(),
        branch_id: branch_id,
        semester: sem,
        status: status == "Active" ? true : false,
      })
      .then((data) => {
        if (data) {
          messageView = "Subject is Created";
          res.redirect("/subject/view");
        }
      })
      .catch((error) => {
        messageCreate = error;
        console.log("error", error);
        res.redirect("/subject/create");
      });
  } else {
    messageCreate = "Enter Subject Name";
    res.redirect("/subject/create");
  }
});
router.get("/view", authMiddleware, async function (req, res, next) {
  //   res.send('respond with a resource');
  let subjects = await subjectModel.find().populate("branch_id");
  res.render("Subject/view", { messageView: messageView, subjects: subjects });
  messageView = "";
});
router.get("/delete/: authMiddleware,id", async function (req, res) {
  console.log("req.params.id", req.params.id);
  subjectModel
    .deleteOne({ _id: req.params.id })
    .then((data) => {
      console.log(data);
      if (data.deletedCount > 0) {
        messageView = "Subject Deleted";
        res.redirect("/subject/view");
      } else {
        messageView = "Subject Not Delete";
        res.redirect("/subject/view");
      }
    })
    .catch((error) => {
      console.log("error", error);
      messageView = error.message();
      res.redirect("/subject/view");
    });
});
router.get("/edit/: authMiddleware,id", async function (req, res, next) {
  //   res.send('respond with a resource');
  let subject = await subjectModel.findOne({ _id: req.params.id });
  // .populate("branch_id");
  //   let branch = await branchModel.findOne({ _id: subject.branch_id._id });
  let branch = await branchModel.find({ status: true });
  console.log(subject);
  res.render("Subject/edit", {
    messageEdit: messageEdit,
    subject: subject,
    branch: branch,
  });
  messageEdit = "";
});
router.post("/edit", authMiddleware, function (req, res, next) {
  //   res.send('respond with a resource');
  let { name, branch_id, sem, status, _id } = req.body;
  if ((name && status, branch_id != "false" && sem != "false")) {
    subjectModel
      .updateOne(
        { _id: _id },
        {
          name: name,
          branch_id: branch_id,
          semester: sem,
          status: status == "Active" ? true : false,
        }
      )
      .then((data) => {
        if (data) {
          messageView = "Subject is Edited";
          res.redirect("/subject/view");
        }
      })
      .catch((error) => {
        messageEdit = error;
        console.log("error", error);
        res.redirect("/subject/edit");
      });
  } else {
    messageEdit = "Enter Subject Name";
    res.redirect("/subject/edit");
  }
});
module.exports = router;
