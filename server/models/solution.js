var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SolutionSchema = new Schema({
  problem: { type: Schema.ObjectId, ref: "Problem", required: true },
  message: { type: String },
  status: {
    type: String,
    required: true,
    enum: ["submitted", "ok", "failed", "running"],
    default: "submitted",
  },
});

// Virtual for this Solution object's URL.
SolutionSchema.virtual("url").get(function () {
  return "/solution/" + this._id;
});

// Virtual for this Solution file's URL.
SolutionSchema.virtual("file").get(function () {
  return "/uploads/" + this._id;
});

// Export model.
module.exports = mongoose.model("Solution", SolutionSchema);
