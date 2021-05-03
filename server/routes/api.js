var express = require("express");
var router = express.Router();

// Require our controllers.
var problem_controller = require("../controllers/problemController");
var solution_controller = require("../controllers/solutionController");

/**
 * @swagger
 * tags:
 *    name: Online-Judge
 *    description: Online Judge for creating problems and judging solutions
 * */

/**
 * @swagger
 * /api/problems:
 *     post:
 *       tags: [Online-Judge]
 *       summary: Create a new Problem
 *       description: Send JSON object to database
 *
 *       parameters:
 *        - in: Name of Problem
 *          name: title
 *          required: true
 *        - in: Detail
 *          name: detail
 *          required: true
 *       responses:
 *         201:
 *           description: The problem created successfully
 *           content:
 *             application/json:
 *               schema:
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
 *
 *         500:
 *           description: Some server error
 */
router.post("/problems", problem_controller.api_problem_create_post);

/**
 * @swagger
 * /api/problems/{id}:
 *   get:
 *     tags: [Online-Judge]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *     summary: Retrieve a problem with specific id.
 *     description: Retrieve a problem with specific id.
 *     responses:
 *       200:
 *         description: A single problem with specific id.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *                   solution:
 *                     type: array
 *                     items:
 *                        type: object
 *                        properties:
 *                          status:
 *                            type: string
 *                            description: The solution status
 *                            example: One of these verdicts ["submitted", "ok", "failed", "running"]
 *                          _id:
 *                            type: string
 *                            description: The solution ID.
 *                            example: 607de21470ad2a2b0b56a125
 *                          problem:
 *                            type: object
 *                            description: The belonging problem
 *                            example:  6082d2b2f5391c900d9a2560
 *       404:
 *         description: Problem Not Found
 */
router.get("/problems/:id", problem_controller.api_problem_detail);

/// PROBLEM ROUTES ///

/**
 * @swagger
 * /api/problems:
 *   get:
 *     tags: [Online-Judge]
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
 *
 *       404:
 *         description: List of Problems Not Found
 */
router.get("/problems", problem_controller.api_problem_list);

/// SOLUTION ROUTES ///

/**
 * @swagger
 * /api/solution/create:
 *     post:
 *       tags: [Online-Judge]
 *       summary: Create a new Solution
 *       description: Send JSON object to database
 *
 *       parameters:
 *        - in: Problem
 *          name: problem-id
 *          required: true
 *        - in: Choose File
 *          name: file
 *          required: true
 *          type: file
 *       responses:
 *         201:
 *           description: The solution created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     description: The solution status
 *                     example: One of these verdicts ["submitted", "ok", "failed", "running"]
 *                   _id:
 *                     type: string
 *                     description: The solution ID.
 *                     example: 607de21470ad2a2b0b56a125
 *                   problem:
 *                     type: object
 *                     description: The belonging problem
 *                     example:  { "_id": "6082d2b2f5391c900d9a2560", "title": "easy", "detail": "print hello world"}
 *
 *         500:
 *           description: Some server error
 */
router.post("/solutions", solution_controller.api_solution_create_post);

/**
 * @swagger
 * /api/solutions/{id}:
 *   get:
 *     tags: [Online-Judge]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *     summary: Retrieve a solution with specific id.
 *     description: Retrieve a solution with specific id.
 *     responses:
 *       200:
 *         description: A single solution with specific id.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   status:
 *                     type: string
 *                     description: The solution status
 *                     example: One of these verdicts ["submitted", "ok", "failed", "running"]
 *                   _id:
 *                     type: string
 *                     description: The solution ID.
 *                     example: 607de21470ad2a2b0b56a125
 *                   problem:
 *                     type: object
 *                     description: The belonging problem
 *                     example:  { "_id": "6082d2b2f5391c900d9a2560", "title": "easy", "detail": "print hello world"}
 *       404:
 *         description: Solution Not Found
 */
router.get("/solutions/:id", solution_controller.api_solution_detail);

/**
 * @swagger
 * /api/solutions/{id}:
 *   put:
 *     tags: [Online-Judge]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *     summary: Update a solution with specific id.
 *     description: Update a solution with specific id.
 *     responses:
 *       200:
 *         description: A single solution with specific id.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   status:
 *                     type: string
 *                     description: The solution status
 *                     example: One of these verdicts ["submitted", "ok", "failed", "running"]
 *                   _id:
 *                     type: string
 *                     description: The solution ID.
 *                     example: 607de21470ad2a2b0b56a125
 *                   problem:
 *                     type: object
 *                     description: The belonging problem
 *                     example:  { "_id": "6082d2b2f5391c900d9a2560", "title": "easy", "detail": "print hello world"}
 *       404:
 *         description: Solution Not Found
 */
router.put("/solutions/:id", solution_controller.api_solution_update);

/**
 * @swagger
 * /api/solutions:
 *   get:
 *     tags: [Online-Judge]
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
 *                   status:
 *                     type: string
 *                     description: The solution status
 *                     example: One of these verdicts ["submitted", "ok", "failed", "running"]
 *                   _id:
 *                     type: string
 *                     description: The solution ID.
 *                     example: 607de21470ad2a2b0b56a125
 *                   problem:
 *                     type: object
 *                     description: The belonging problem
 *                     example:  { "_id": "6082d2b2f5391c900d9a2560", "title": "easy", "detail": "print hello world"}
 *       404:
 *         description: List of Solutions Not Found
 */
router.get("/solutions", solution_controller.api_solution_list);

module.exports = router;
