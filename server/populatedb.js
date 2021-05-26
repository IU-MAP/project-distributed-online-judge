#! /usr/bin/env node

console.log(
  "This script populates some test problems, solutions to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

var devDbUrl =
  "mongodb+srv://user:pass@cluster0.uk9hw.mongodb.net/doj-test?retryWrites=true&w=majority";

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Problem = require("./models/problem");
var Solution = require("./models/solution");
var fs = require("fs");

var mongoose = require("mongoose");
var mongoDB = userArgs[0] || process.env.MONGODB_URI || devDbUrl;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var problems = [];
var solutions = [];

var dir = `${__dirname}/public/uploads/`;

if (fs.existsSync(dir)) {
  fs.rmSync(dir, { recursive: true, force: true });
}
fs.mkdirSync(dir);

var dataDir = `${__dirname}/../database_data/problems/`;

var problemFilePaths = fs
  .readdirSync(dataDir)
  .map((e) => `${dataDir}/${e}/testdata.zip`);

var solutionFilePaths = fs
  .readdirSync(dataDir)
  .map((e) => `${dataDir}/${e}/solution.cpp`);

function createProblem(title, detail, filePath, cb) {
  var problem = new Problem({ title, detail });
  fs.copyFileSync(filePath, `${dir}${problem._id}.zip`);
  problem.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    problems.push(problem._id);
    cb();
  });
}

function createSolution(problem, filePath, cb) {
  var solution = new Solution({ problem });
  fs.copyFileSync(filePath, `${dir}${solution._id}`);
  solution.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    solutions.push(solution._id);
    cb();
  });
}

function createProblems(cb) {
  async.parallel(
    problemFilePaths.map((p, i) => (callback) => {
      createProblem(
        `Problem ${i + 1}`,
        `This is problem ${i + 1}`,
        p,
        callback
      );
    }),
    cb
  );
}

function createSolutions(cb) {
  async.parallel(
    solutionFilePaths.reduce((acc, cur, i) => {
      acc.push((callback) => {
        createSolution(
          problems[Math.floor(Math.random() * problems.length)],
          cur,
          callback
        );
      });
      acc.push((callback) => {
        createSolution(problems[i], cur, callback);
      });
      return acc;
    }, []),
    cb
  );
}

function cleanUp(cb) {
  async.parallel(
    [
      (callback) => {
        Problem.remove({}, (err) => {
          if (err) {
            callback(err, null);
            return;
          }
          console.log("Clean up problem collection!");
          callback();
        });
      },
      (callback) => {
        Solution.remove({}, (err) => {
          if (err) {
            callback(err, null);
            return;
          }
          console.log("Clean up solution collection!");
          callback();
        });
      },
    ],
    cb
  );
}

async.series(
  [cleanUp, createProblems, createSolutions],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("Errors: " + err);
    } else {
      console.log("Problems:", problems);
      console.log("Solutions:", solutions);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
