var Problem = require("../models/problem");
var Solution = require("../models/solution");

const { body, validationResult } = require("express-validator");

var async = require("async");
var fs = require("fs");

if (!fs.existsSync(`${__dirname}/../public/uploads/`)) {
  fs.mkdirSync(`${__dirname}/../public/uploads/`);
}

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

// Get list of all problems.
exports.api_problem_list = function (req, res, next) {
  Problem.find().exec(function (err, list_problems) {
    if (err) {
      res.status(500).end();
    } else {
      // Successful, so send json
      res.json(list_problems);
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

// Get detail a specific problem.
exports.api_problem_detail = function (req, res, next) {
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
        res.status(500).send();
      }
      if (results.problem == null) {
        res.status(404).end();
      }
      // Successful, so send results
      res.json({ ...results.problem._doc, solution: results.problem_solution });
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

    // Check file extension
    const validFile = (() => {
      if (!req.files || !req.files.file) return false;
      const filename = req.files.file.name;
      const filenameSplitted = filename.split(".");
      const extension = filenameSplitted[
        filenameSplitted.length - 1
      ].toLowerCase();
      return extension == "zip";
    })();

    if (!errors.isEmpty() || !validFile) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render("problem_form", {
        title: "Create Problem",
        problem: problem,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Save problem.
      async.parallel(
        [
          function (callback) {
            req.files.file.mv(
              `${__dirname}/../public/uploads/${problem._id}.zip`,
              callback
            );
          },
          function (callback) {
            problem.save(callback);
          },
        ],
        function (err) {
          if (err) {
            return next(err);
          }
          // Successful - redirect to new problem record.
          res.redirect(problem.url);
        }
      );
    }
  },
];

// Handle problem create on POST (api).
exports.api_problem_create_post = [
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

    // Check file extension
    const validFile = (() => {
      if (!req.files || !req.files.file) return false;
      return true;
      const filename = req.files.file.name;
      const filenameSplitted = filename.split(".");
      const extension = filenameSplitted[
        filenameSplitted.length - 1
      ].toLowerCase();
      return extension == "zip";
    })();

    if (!errors.isEmpty() || !validFile) {
      // There are errors. Send verror messages.
      res.status(400).json(errors.array());
    } else {
      // Data from form is valid. Save problem.
      async.parallel(
        [
          function (callback) {
            req.files.file.mv(
              `${__dirname}/../public/uploads/${problem._id}.zip`,
              callback
            );
          },
          function (callback) {
            problem.save(callback);
          },
        ],
        function (err) {
          if (err) {
            res.status(500).send();
          }
          // Successful - send new problem record.
          res.status(201).json(problem);
        }
      );
    }
  },
];
