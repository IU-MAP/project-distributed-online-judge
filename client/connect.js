const io = require("socket.io-client");
const fs = require("fs");
const request = require("request");
const { exec } = require("child_process");

const host = process.env.DOJ_HOST || "http://localhost:3000";
const socket = io(host);

socket.on("solution:create", (data) => {
  const writer = fs.createWriteStream(data._id);
  request(`${host}/uploads/${data._id}`).pipe(writer);
  writer.on("finish", () => {
    exec(`cat ${data._id}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
      } else {
        console.log(stdout);
      }
    });
  });
});
