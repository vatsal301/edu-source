const mongoose = require("mongoose");
// const mongoosePaginate = require("mongoose-paginate-v2");

let subjectSchema = new mongoose.Schema(
  {
    name: { type: "String", unique: true },
    branch_id: { type: mongoose.Schema.Types.ObjectId, ref: "branchs" },
    semester : Number,
    status: Boolean,
  },
  { timestamps: true }
);

// subjectSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("subjects", subjectSchema);
