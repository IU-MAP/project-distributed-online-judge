var request = require("supertest");
var express = require("express");
var cookieParser = require("cookie-parser");
var fileUpload = require("express-fileupload");
var apiRouter = require("../routes/api");

// Mongo Testing config
var mongoose = require("mongoose");
var { MongoMemoryServer } = require("mongodb-memory-server");

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

test("Create new problem", (done) => {
  request(app)
    .post("/api/problems")
    .type("form")
    .send({ title: "test problem", detail: "This is a test problem." })
    .expect("Content-Type", /json/)
    .expect(200, done);
});

test("Get problem list", (done) => {
  request(app)
    .get("/api/problems")
    .expect("Content-Type", /json/)
    .expect(200, done);
});

test("Create new solution", (done) => {
  request(app)
    .post("/api/problems")
    .type("form")
    .send({
      title: "another test problem",
      detail: "This is another test problem.",
    })
    .then((value) => {
      request(app)
        .post("/api/solutions")
        .field("problem", value.body._id)
        .attach("file", `${__dirname}/../app.js`)
        .expect("Content-Type", /json/)
        .expect(200, done);
    });
});

test("Get solution list", (done) => {
  request(app)
    .get("/api/solutions")
    .expect("Content-Type", /json/)
    .expect(200, done);
});
