var express = require("express");
var router = express.Router();

// Require our controllers.
var problem_controller = require("../controllers/problemController");
var solution_controller = require("../controllers/solutionController");

/// PROBLEM ROUTES ///

// GET catalog home page.
router.get("/", function (req, res) {
  res.redirect("/problems");
});

// GET request for creating a Problem. NOTE This must come before routes that display Problem (uses id).
router.get("/problem/create", problem_controller.problem_create_get);

// POST request for creating Problem.
router.post("/problem/create", problem_controller.problem_create_post);

// GET request for one Problem.
router.get("/problem/:id", problem_controller.problem_detail);

// GET request for list of all Problem.
router.get("/problems", problem_controller.problem_list);

/// SOLUTION ROUTES ///

// GET request for creating Solution. NOTE This must come before route for id (i.e. display solution).
router.get("/solution/create", solution_controller.solution_create_get);

// POST request for creating Solution.
router.post("/solution/create", solution_controller.solution_create_post);

// GET request for one Solution.
router.get("/solution/:id", solution_controller.solution_detail);

// GET request for list of all Solutions.
router.get("/solutions", solution_controller.solution_list);

module.exports = router;
