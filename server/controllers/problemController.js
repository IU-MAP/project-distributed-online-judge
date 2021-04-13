var Problem = require("../models/problem");
var Solution = require("../models/solution");

const { body, validationResult } = require("express-validator");

var async = require("async");

// Display list of all problems.
exports.problem_list = function (req, res, next) {
  Problem.find().exec(function (err, list_problems) {
    if (err) {
      return next(err);
    } else {
      // Successful, so render
      res.render("problem_list", {
        title: "Problem List",
        problem_list: list_problems,
      });
    }
  });
};

// Display detail page for a specific problem.
exports.problem_detail = function (req, res, next) {
  async.parallel(
    {
      problem: function (callback) {
        Problem.findById(req.params.id).exec(callback);
      },
      problem_solution: function (callback) {
        Solution.find({ problem: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.problem == null) {
        // No results.
        var err = new Error("Problem not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("problem_detail", {
        title: results.problem.title,
        problem: results.problem,
        problem_solutions: results.problem_solution,
      });
    }
  );
};

// Display problem create form on GET.
exports.problem_create_get = function (req, res, next) {
  res.render("problem_form", {
    title: "Create Problem",
  });
};

// Handle problem create on POST.
exports.problem_create_post = [
  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("detail", "Detail must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Problem object with escaped and trimmed data.
    var problem = new Problem({
      title: req.body.title,
      detail: req.body.detail,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render("problem_form", {
        title: "Create Problem",
        problem: problem,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Save problem.
      problem.save(function (err) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new problem record.
        res.redirect(problem.url);
      });
    }
  },
];
