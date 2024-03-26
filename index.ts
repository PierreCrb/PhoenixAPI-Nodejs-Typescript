import PhoenixAPI from "./api";
import config from "./config.json";

const api = new PhoenixAPI(Number(config.port));

function formatTime(date: Date): string {
  var hours = date.getHours().toString().padStart(2, "0");
  var minutes = date.getMinutes().toString().padStart(2, "0");
  var seconds = date.getSeconds().toString().padStart(2, "0");

  return "[" + hours + ":" + minutes + ":" + seconds + "]";
}

// Example of receiving messages

function receiveMessages() {
  while (!api.empty()) {
    const message = api.get_message();

    if (message) {
      const parseMessage = JSON.parse(message);
      if (parseMessage.type === 1) {
        console.log(`${formatTime(new Date())} [RECV] ${parseMessage.packet}`);
      } else if (parseMessage.type === 0) {
        console.log(`${formatTime(new Date())} [SEND] ${parseMessage.packet}`);
      }
    }
  }

  setTimeout(receiveMessages, 100);
}

receiveMessages();

// Walking example

// async function playerWalk(x: number, y: number) {
//   if (!api.empty()) {
//     await api.playerWalk(x, y);
//   }
// }

// playerWalk(15, 23);
