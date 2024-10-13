auth = (req, res, next) => {
  try {
    if (req.session.count) {
      next();
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.log("error", error);
    res.redirect("/admin");
  }
};

module.exports = auth;
