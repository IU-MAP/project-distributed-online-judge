var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ProblemSchema = new Schema({
  title: { type: String, required: true },
  detail: { type: String, required: true },
});

// Virtual for this Problem instance URL.
ProblemSchema.virtual("url").get(function () {
  return "/ui/problems/" + this._id;
});

// Virtual for this Problem file's URL.
ProblemSchema.virtual("file").get(function () {
  return "/uploads/" + this._id;
});

// Export model.
module.exports = mongoose.model("Problem", ProblemSchema);
