var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ProblemSchema = new Schema({
  title: { type: String, required: true },
  detail: { type: String, required: true },
});

// Virtual for this Problem instance URL.
ProblemSchema.virtual("url").get(function () {
  return "/problem/" + this._id;
});

// Export model.
module.exports = mongoose.model("Problem", ProblemSchema);