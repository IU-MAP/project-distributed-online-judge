var Solution = require("../models/solution");
var Problem = require("../models/problem");
var async = require("async");
var fs = require("fs");

if (!fs.existsSync(`${__dirname}/../public/uploads/`)) {
  fs.mkdirSync(`${__dirname}/../public/uploads/`);
}

const { body, validationResult } = require("express-validator");

// Display list of all Solution.
exports.solution_list = function (req, res, next) {
  Solution.find()
    .populate("problem")
    .exec(function (err, list_solutions) {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      res.render("solution_list", {
        title: "Solution List",
        solution_list: list_solutions,
      });
    });
};

// Get list of all Solution.
exports.api_solution_list = function (req, res, next) {
  Solution.find()
    .populate("problem")
    .exec(function (err, list_solutions) {
      if (err) {
        res.status(500).end();
      }
      // Successful, so send
      res.json(list_solutions);
    });
};

// Display detail page for a specific Solution.
exports.solution_detail = function (req, res, next) {
  Solution.findById(req.params.id)
    .populate("problem")
    .exec(function (err, solution) {
      if (err) {
        return next(err);
      }
      if (solution == null) {
        // No results.
        var err = new Error("Solution not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("solution_detail", {
        title: "Solution Detail",
        solution: solution,
      });
    });
};

// Get detail page for a specific Solution.
exports.api_solution_detail = function (req, res, next) {
  Solution.findById(req.params.id)
    .populate("problem")
    .exec(function (err, solution) {
      if (err) {
        return res.status(500).end();
      }
      if (solution == null) {
        return res.status(404).end();
      }
      // Successful, so send.
      res.json(solution);
    });
};

// Display Solution create form on GET.
exports.solution_create_get = function (req, res, next) {
  Problem.find({}, "title").exec(function (err, list_problems) {
    if (err) {
      return next(err);
    }
    // Successful, so render.
    res.render("solution_form", {
      title: "Create Solution",
      problem_list: list_problems,
    });
  });
};

// Handle Solution create on POST.
exports.solution_create_post = [
  // Validate and santise the name field.
  body("problem", "Problem must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    console.log(errors);

    // Create a solution object with escaped and trimmed data.
    var solution = new Solution({ problem: req.body.problem });

    if (!errors.isEmpty() || !req.files || !req.files.file) {
      // There are errors. Render form again with sanitized values/error messages.

      Problem.find({}, "title").exec(function (err, list_problems) {
        if (err) {
          return next(err);
        }
        // Successful, so render.
        res.render("solution_form", {
          title: "Create Solution",
          problem_list: list_problems,
          errors: errors.array(),
        });
      });
      return;
    } else {
      // Data from form is valid. Save solution.
      async.parallel(
        [
          function (callback) {
            req.files.file.mv(
              `${__dirname}/../public/uploads/${solution._id}`,
              callback
            );
          },
          function (callback) {
            solution.save(callback);
          },
        ],
        async function (err) {
          if (err) {
            return next(err);
          }

          // Emit event
          const io = req.app.get("socketio");
          const sockets = await io.fetchSockets();
          io.to(sockets[Math.floor(Math.random() * sockets.length)].id).emit(
            "solution:create",
            solution
          );

          // Successful - redirect to new problem record.
          res.redirect(solution.url);
        }
      );
    }
  },
];

// Handle Solution create on POST (api).
exports.api_solution_create_post = [
  // Validate and santise the name field.
  body("problem", "Problem must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    console.log(errors);

    // Create a solution object with escaped and trimmed data.
    var solution = new Solution({ problem: req.body.problem });

    if (!errors.isEmpty() || !req.files || !req.files.file) {
      // There are errors. Render form again with sanitized values/error messages.

      Problem.find({}, "title").exec(function (err, list_problems) {
        if (err) {
          return res.status(500).end();
        }
        return res.status(400).json(errors);
      });
      return;
    } else {
      // Data from form is valid. Save solution.
      async.parallel(
        [
          function (callback) {
            req.files.file.mv(
              `${__dirname}/../public/uploads/${solution._id}`,
              callback
            );
          },
          function (callback) {
            solution.save(callback);
          },
        ],
        async function (err) {
          if (err) {
            return res.status(500).send();
          }

          // Emit event
          try {
            const io = req.app.get("socketio");
            const sockets = await io.fetchSockets();
            io.to(sockets[Math.floor(Math.random() * sockets.length)].id).emit(
              "solution:create",
              solution
            );
          } catch (e) {
            console.log(e);
          }

          // Successful - send new solution record.
          return res.status(201).json(solution);
        }
      );
    }
  },
];

// Handle Solution update on PUT.
exports.api_solution_update = [
  // Validate and sanitize fields.
  body("problem", "Problem must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("message").trim().escape(),
  body("status").trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a solution object with escaped and trimmed data.
    var solution = new Solution({
      problem: req.body.problem,
      message: req.body.message,
      status: req.body.status,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      Problem.find({}, "title").exec(function (err, list_problems) {
        if (err) {
          return res.status(500).end();
        }
        return res.status(400).json(errors);
      });
      return;
    } else {
      // Data from form is valid.
      Solution.findByIdAndUpdate(
        req.params.id,
        solution,
        {},
        function (err, thesolution) {
          if (err) {
            return res.status(500).end();
          }
          // Successful - send updated solution record.
          res.status(200).json(solution);
        }
      );
    }
  },
];
