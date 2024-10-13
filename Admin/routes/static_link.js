var express = require("express");
var router = express.Router();
let linksModel = require("../models/static_link.model");
let authMiddleware = require("../middlewares/auth");
let messageCreate = "";
let messageView = "";
let messageEdit = "";

/* GET users listing. */
router.get("/create", authMiddleware, function (req, res, next) {
  //   res.send('respond with a resource');
  res.render("Links/create", { messageCreate: messageCreate });
  messageCreate = "";
});
router.post("/create", authMiddleware, function (req, res, next) {
  //   res.send('respond with a resource');
  let { name, link, status } = req.body;
  if (name && status && link) {
    linksModel
      .create({
        name: name.toUpperCase(),
        link: link,
        status: status == "Active" ? true : false,
      })
      .then((data) => {
        if (data) {
          messageView = "Static Link is Created";
          res.redirect("/links/view");
        }
      })
      .catch((error) => {
        messageCreate = error;
        console.log("error", error);
        res.redirect("/links/create");
      });
  } else {
    messageCreate = "Enter Link Name";
    res.redirect("/links/create");
  }
});
router.get("/view", authMiddleware, async function (req, res, next) {
  //   res.send('respond with a resource');
  let links = await linksModel.find();
  res.render("Links/view", { messageView: messageView, links: links });
  messageView = "";
});
router.get("/delete/:id", authMiddleware, async function (req, res) {
  console.log("req.params.id", req.params.id);
  linksModel
    .deleteOne({ _id: req.params.id })
    .then((data) => {
      if (data) {
        messageView = "Link Deleted";
        res.redirect("/links/view");
      }
    })
    .catch((error) => {
      console.log("error", error);
      messageView = error.message();
      res.redirect("/links/view");
    });
});
router.get("/edit/:id", authMiddleware, async function (req, res, next) {
  //   res.send('respond with a resource');
  let links = await linksModel.findOne({ _id: req.params.id });
  res.render("Links/edit", { messageEdit: messageEdit, links: links });
  messageEdit = "";
});
router.post("/edit", authMiddleware, function (req, res, next) {
  //   res.send('respond with a resource');
  let { name, status, _id, link } = req.body;
  if (name && status && link) {
    linksModel
      .updateOne(
        { _id: _id },
        {
          name: name,
          link: link,
          status: status == "Active" ? true : false,
        }
      )
      .then((data) => {
        if (data) {
          messageView = "Link is Edited";
          res.redirect("/links/view");
        }
      })
      .catch((error) => {
        messageEdit = error;
        console.log("error", error);
        res.redirect("/links/edit");
      });
  } else {
    messageEdit = "Enter Link Name";
    res.redirect("/links/edit");
  }
});
module.exports = router;
