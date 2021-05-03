const io = require("socket.io-client");
const fs = require("fs");
const request = require("request");
const { exec } = require("child_process");

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
  writer.on("finish", () => {
    exec(`cat data/${data._id}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Solution ${data._id} content:`);
        console.log(stdout);
      }
    });
    exec(`node data/${data._id}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Solution ${data._id} output:`);
        console.log(stdout);
      }
    });
  });
});
