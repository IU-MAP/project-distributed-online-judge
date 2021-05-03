var request = require("supertest");
var express = require("express");
var assert = require("assert");
var cookieParser = require("cookie-parser");
var fileUpload = require("express-fileupload");
var apiRouter = require("../routes/api");

// Mongo Testing config
var mongoose = require("mongoose");
var { MongoMemoryServer } = require("mongodb-memory-server");
const problem = require("../models/problem");

var mongoServer = new MongoMemoryServer();

mongoose.Promise = Promise;
mongoServer.getUri().then((mongoUri) => {
  const mongooseOpts = {
    // options for mongoose 4.11.3 and above
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
    useNewUrlParser: true,
  };

  mongoose.connect(mongoUri, mongooseOpts);

  mongoose.connection.on("error", (e) => {
    if (e.message.code === "ETIMEDOUT") {
      console.log(e);
      mongoose.connect(mongoUri, mongooseOpts);
    }
    console.log(e);
  });

  mongoose.connection.once("open", () => {
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  });
});

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use("/api", apiRouter);

afterAll(async (done) => {
  // Closing the DB connection allows Jest to exit successfully.
  try {
    await mongoServer.stop();
    done();
  } catch (error) {
    console.error(error);
  }
});

let problemId, solutionId; // not proud of this, but I needed to get it done

test("Create new problem", (done) => {
  request(app)
    .post("/api/problems")
    .type("form")
    .field("title", "test problem")
    .field("detail", "This is a test problem.")
    .attach("file", `${__dirname}/../app.js`)
    .expect("Content-Type", /json/)
    .expect(201)
    .then((res) => {
      problemId = res.body._id;
      assert(res.body.title, "test problem");
      assert(res.body.detail, "This is a test problem.");
      done();
    })
    .catch((err) => done(err));
});

test("Get problem list", (done) => {
  request(app)
    .get("/api/problems")
    .expect("Content-Type", /json/)
    .expect(200)
    .then((res) => {
      assert(res.body.length, 1);
      assert(res.body[0].title, "test problem");
      assert(res.body[0].detail, "This is a test problem.");
      done();
    })
    .catch((err) => done(err));
});

test("Create new solution", (done) => {
  request(app)
    .post("/api/solutions")
    .field("problem", problemId)
    .attach("file", `${__dirname}/../app.js`)
    .expect("Content-Type", /json/)
    .expect(201)
    .then((res) => {
      solutionId = res.body._id;
      assert(res.body.problem, problemId);
      assert(res.body.status, "submitted");
      done();
    })
    .catch((err) => done(err));
});

test("Get solution list", (done) => {
  request(app)
    .get("/api/solutions")
    .expect("Content-Type", /json/)
    .expect(200)
    .then((res) => {
      assert(res.body.length, 1);
      assert(res.body[0].problem.title, "test problem");
      assert(res.body[0].status, "submitted");
      done();
    })
    .catch((err) => done(err));
});

test("Get problem details", (done) => {
  request(app)
    .get("/api/problems/" + problemId) // test problem ID as taken from global variable
    .expect("Content-Type", /json/)
    .expect(200)
    .then((res) => {
      assert(res.body._id, problemId);
      assert(res.body.title, "test problem");
      assert(res.body.detail, "This is a test problem");
      assert(res.body.solution[0]._id, solutionId);
      done();
    })
    .catch((err) => done(err));
});

test("Get solution details", (done) => {
  request(app)
    .get("/api/solutions/" + solutionId) // test solution ID taken from global variable
    .expect("Content-Type", /json/)
    .expect(200)
    .then((res) => {
      assert(res.body._id, solutionId);
      assert(res.body.status, "submitted");
      assert(res.body.problem._id, problemId);
      done();
    })
    .catch((err) => done(err));
});

test("Update a solution", (done) => {
  request(app)
    .put(`/api/solutions/${solutionId}`)
    .type("form")
    .send({
      problem: problemId,
      message: "Error at line 1",
      status: "failed",
    })
    .expect("Content-Type", /json/)
    .expect(200)
    .then((res) => {
      assert(res.body.problem, problemId);
      assert(res.body.message, "Error at line 1");
      assert(res.body.status, "failed");
      done();
    })
    .catch((err) => done(err));
});
