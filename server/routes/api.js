var express = require("express");
var router = express.Router();

// Require our controllers.
var problem_controller = require("../controllers/problemController");
var solution_controller = require("../controllers/solutionController");

router.post("/problems", problem_controller.api_problem_create_post);

// GET request for one Problem.
router.get("/problems/:id", problem_controller.api_problem_detail);

/// PROBLEM ROUTES ///

/**
 * @swagger
 * /api/problems:
 *   get:
 *     summary: Retrieve a list of problems.
 *     description: Retrieve a list of problems.
 *     responses:
 *       200:
 *         description: A list of problems.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The problem ID.
 *                     example: 607de21470ad2a2b0b56a125
 *                   title:
 *                     type: string
 *                     description: The problem's title.
 *                     example: hello world
 *                   detail:
 *                     type: string
 *                     description: The problem's detail.
 *                     example: print hello world
 */
router.get("/problems", problem_controller.api_problem_list);

/// SOLUTION ROUTES ///

// POST request for creating Solution.
router.post("/solutions", solution_controller.api_solution_create_post);

// GET request for one Solution.
router.get("/solutions/:id", solution_controller.api_solution_detail);

/**
 * @swagger
 * /api/solutions:
 *   get:
 *     summary: Retrieve a list of solutions.
 *     description: Retrieve a list of solutions.
 *     responses:
 *       200:
 *         description: A list of solutions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The problem ID.
 *                     example: 607de21470ad2a2b0b56a125
 *                   title:
 *                     type: string
 *                     description: The problem's title.
 *                     example: hello world
 *                   detail:
 *                     type: string
 *                     description: The problem's detail.
 *                     example: print hello world
 */
router.get("/solutions", solution_controller.api_solution_list);

module.exports = router;
