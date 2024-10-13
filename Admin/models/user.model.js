const mongoose = require("mongoose");
// const mongoosePaginate = require("mongoose-paginate-v2");

let loginsSchema = new mongoose.Schema(
  {
    username: "String",
    password: "String",
    is_admin: Boolean,
  },
  { timestamps: true }
);

// loginsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("users", loginsSchema);
