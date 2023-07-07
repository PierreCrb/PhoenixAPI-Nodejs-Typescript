const net = require("net");
const { parentPort } = require("worker_threads");
const config = require("./config.json");

const HOST = String(config.host);
const PORT = Number(config.port);
let data = "";

const socket = new net.Socket();
socket.connect({ host: HOST, port: PORT });

socket.on("data", (buffer) => {
  data += buffer.toString();
  let delim_pos = data.indexOf("\x01");

  while (delim_pos !== -1) {
    const msg = data.substring(0, delim_pos);
    data = data.substring(delim_pos + 1);

    parentPort.postMessage(msg);

    delim_pos = data.indexOf("\x01");
  }
});

socket.on("error", (err) => {
  console.error("Socket error:", err);
});

socket.on("close", () => {
  console.log("Socket closed");
});
