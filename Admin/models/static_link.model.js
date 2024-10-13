const mongoose = require("mongoose");
// const mongoosePaginate = require("mongoose-paginate-v2");

let branchSchema = new mongoose.Schema(
  {
    name: { type: "String", unique: true },
    link: "String",
    status: Boolean,
  },
  { timestamps: true }
);

// branchSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("links", branchSchema);
