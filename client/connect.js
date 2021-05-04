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

socket.on("solution:create", (data) => {
  const writer = fs.createWriteStream(`data/${data._id}`);
  request(`${host}/uploads/${data._id}`).pipe(writer);
  writer.on("finish", async () => {
    //PUT requst for changing status to "running"
    await axios.put(`${host}/api/solutions/${data._id}`, {
      problem: data.problem,
      status: "running",
    });
    exec(
      `./checker.sh ${data._id} ${data.problem} ${host}/uploads`,
      async (err, stdout, stderr) => {
        if (err) {
          await axios.put(`${host}/api/solutions/${data._id}`, {
            problem: data.problem,
            status: "submitted",
          });
        } else {
          //PUT requst for changing status to failed or OK
          //stdout will echo AC if all testcases are correct, otherwise WA verdict
          const outputs = stdout.split("\n").filter((l) => !!l.trim());
          if (outputs[outputs.length - 1] == "AC") {
            await axios.put(`${host}/api/solutions/${data._id}`, {
              problem: data.problem,
              status: "ok",
            });
          } else {
            await axios.put(`${host}/api/solutions/${data._id}`, {
              problem: data.problem,
              status: "failed",
            });
          }
        }
      }
    );
  });
});
