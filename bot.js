const tmi = require("tmi.js");
const db = require("./model");
const axios = require("axios");
const gamble = require("./helperFunctions/gamble.js");
const rollDice = require("./helperFunctions/rollDice");
const weather = require("./helperFunctions/weather");
const watchTime = require("./helperFunctions/watchTime");
const getAuth = require("./helperFunctions/getAuth");
const addCommand = require("./helperFunctions/addCommand");
const addEmote = require("./helperFunctions/addEmote");
const addQuote = require("./helperFunctions/addQuote");
const commands = require("./helperFunctions/commands");
const emote = require("./helperFunctions/emote");
const addPoints = require("./helperFunctions/addPoints");
const quote = require("./helperFunctions/quote");
const talked = require("./helperFunctions/talked");
const points = require("./helperFunctions/points");
const setPoints = require("./helperFunctions/setPoints");
const ban = require("./helperFunctions/ban");
const welcomed = [];

//required in memory data
let auth = getAuth();
let viewers = [];
let dbEmotes = [];
let dbQuotes = [];
let dbModCommands = {};

const client = new tmi.client(auth[0]);
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

client.connect();

client.on("vips", (channel, vips) => {
  // Do your stuff.
  console.log(channel);
  console.log(vips);
});

setInterval(function () {
  axios
    .get(`http://tmi.twitch.tv/group/user/deathxxscythe/chatters`)
    .then((res) => {
      //   console.log(res.data);
      viewers = res.data.chatters.viewers;
      viewers = viewers.concat(res.data.chatters.moderators);
      viewers = viewers.concat(res.data.chatters.vips);
    })
    .catch((err) => {
      console.log(err);
    });
  const addPoints = (arr) => {
    for (i in arr) {
      db.giveUserPoints(5, viewers[i])
        .then(() => {})
        .catch((err) => {
          console.log(err.message);
        });
    }
  };
  addPoints(viewers);
}, 60000);

function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  }
  chatLog(context, msg);

  // if (!welcomed.includes(context["display-name"])) {
  //   client.say(target, `@${context["display-name"]} Welcome to the chat!`);
  //   welcomed.push(context["display-name"]);
  // }

  const cmName = msg.trim();
  // const commandNameLower = cmName.toLowerCase();
  const commandName = splitMessageToArr(cmName);

  switch (commandName[0]) {
    case "!addCommand":
      addCommand(client, target, context, commandName, dbModCommands);
      break;
    case "!addEmote":
      addEmote(context, commandName);
      break;
    case "!addPoints":
      addPoints(context, auth[0]);
      break;
    case "!commands":
      commands(client, target);
      break;
    case "!squid":
      client.say(target, "Squid1 Squid3 Squid2 Squid4 ");
      break;
    case "!emote":
      emote(client, target);
      break;
    case "!quote":
      quote(client, target, dbQuotes);
      break;
    case "!talked":
      talked(context, client, target);
      break;
    case "!ban":
      ban(client, target, context, commandName);
      break;
    case "!watchTime":
      watchTime(client, target, context, commandName);
      break;
    case "!dice":
      const num = rollDice();
      client.say(target, `You rolled a ${num}`);
      break;
    case "!weather":
      weather(client, target, context, commandName, auth[1], auth[2]);
      break;
    case "!points":
      points(context, client, target);
      break;
    case "!gamble":
      if (commandName[1] == undefined) {
        client.say(target, "Please include a bet value");
        return;
      }
      gamble(target, context.username, commandName[1], client);
      break;
    case "!setPoints":
      setPoints(context, auth[0]);
      break;
    case "!addQuote":
      addQuote(context, commandName, dbQuotes);
      break;
    case "!test":
      console.log(auth[1]);
      break;
    default:
  }

  //work in progress for commands in db
  if (dbModCommands[commandName[0]] != undefined) {
    client.say(target, dbModCommands[commandName[0]]);
  }
}

function splitMessageToArr(message) {
  return message.split(" ");
}

function emojiSTORM(leNum) {
  let emojiStorm = [];
  if (leNum > 100) {
    leNum = 1;
  }
  for (let i = 0; i < leNum; i++) {
    const emoteNumber = emojiRoll();
    emojiStorm.push(dbEmotes[emoteNumber]);
  }
  return emojiStorm;
}

function emojiRoll() {
  const sides = dbEmotes.length;

  return Math.floor(Math.random() * sides) + 1;
}

function quoteRoll() {
  const sides = dbQuotes.length;

  return Math.floor(Math.random() * sides) + 1;
}

function chatLog(context, msg) {
  let log = {
    user: context.username,
    message: msg,
    timeStamp: new Date().toISOString(),
  };
  db.chatLog(log)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
  db.getEmotes()
    .then((res) => {
      res.forEach((item) => {
        dbEmotes.push(item.emote);
      });
    })
    .catch((err) => {
      console.log(err);
    });
  db.getQuotes().then((res) => {
    res.forEach((item) => {
      dbQuotes.push(item.quote);
    });
  });
  db.getModCommands()
    .then((res) => {
      res.forEach((item) => {
        dbModCommands[item.commandName] = item.response;
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
