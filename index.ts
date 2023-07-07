import PhoenixAPI from "./api";
import config from "./config.json";

const api = new PhoenixAPI(Number(config.port));

// Example of receiving messages

function receiveMessages() {
  while (!api.empty()) {
    const message = api.get_message();
    console.log(message);
  }

  setTimeout(receiveMessages, 100);
}

receiveMessages();

// Walking example

// async function playerWalk(x: number, y: number) {
//   if (!api.empty()) {
//     await api.playerWalk(x, y);
//   }

//   setTimeout(() => playerWalk(x, y), 5000);
// }

// playerWalk(15, 23);
