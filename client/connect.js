const io = require("socket.io-client");
const fs = require("fs");
const request = require("request");
const { exec } = require("child_process");
const axios = require("axios");

if (!fs.existsSync(`${__dirname}/data/`)) {
  fs.mkdirSync(`${__dirname}/data/`);
}

if (!fs.existsSync(`${__dirname}/judge/`)) {
  fs.mkdirSync(`${__dirname}/judge/`);
}

const host = process.env.DOJ_HOST || "http://localhost:3000";
const socket = io(host);

const runSolution = async (solutionId) => {
  try {
    const { data } = await axios.get(`${host}/api/solutions/${solutionId}`);
    if (data.status != "submitted") return;

    const writer = fs.createWriteStream(`data/${data._id}`);

    request(`${host}/uploads/${data._id}`).pipe(writer);

    writer.on("finish", async () => {
      console.log(`Running solution ${data._id}...`);
      await axios.put(`${host}/api/solutions/${data._id}`, {
        problem: data.problem._id,
        status: "running",
      });

      exec(
        `./checker.sh ${data._id} ${data.problem._id} ${host}/uploads`,
        async (err, stdout, stderr) => {
          if (err) {
            console.log(`Solution ${data._id} failed!`);
            await axios.put(`${host}/api/solutions/${data._id}`, {
              problem: data.problem._id,
              status: "failed",
            });
          } else {
            console.log(`Solution ${data._id} ok!`);
            await axios.put(`${host}/api/solutions/${data._id}`, {
              problem: data.problem._id,
              status: "ok",
              time: Math.round(parseFloat(stdout)*1000),
            });
          }
        }
      );
    });
  } catch (err) {
    console.error(err);
  }
};

socket.on("solution:create", (data) => {
  runSolution(data._id);
});

socket.on("solution:submitted", async (solutions) => {
  solutions.forEach(async (s) => {
    await runSolution(s._id);
  });
});
