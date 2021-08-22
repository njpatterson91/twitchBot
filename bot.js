const tmi = require("tmi.js");
const db = require("./model");
const axios = require("axios");
const gamble = require("./helperFunctions/gamble.js");
const rollDice = require("./helperFunctions/rollDice");
const weather = require("./helperFunctions/weather");
const watchTime = require("./helperFunctions/watchTime");
const getAuth = require("./helperFunctions/getAuth");
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

// setInterval(
//   function (client) {
//     client.say(target, "Yeet");
//   },
//   [20]
// );

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
      if (context.mod == true || context.badges.broadcaster == 1) {
        commandName.shift();
        let x = commandName.shift();
        console.log(x);
        console.log(commandName.join(" "));
        let commandToInsert = commandName.join(" ");

        let toInsert = {
          commandName: x,
          response: commandToInsert,
          createdBy: context.username,
        };
        db.addModCommands(toInsert)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });

        dbModCommands[x] = commandToInsert;
      } else {
        client.say(target, `You are not a mod!`);
      }
      break;
    case "!addEmote":
      if (context.mod == true || context.badges.broadcaster == 1) {
        let toInsert = { emote: commandName[1] };
        db.addEmote(toInsert)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
        db.getEmotes()
          .then((res) => {
            res.forEach((item) => {
              dbEmotes.push(item.emote);
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
      break;
    case "!addPoints":
      if (
        context.username.toLowerCase() == opts.identity.username.toLowerCase()
      ) {
        db.giveUserPoints(commandName[2], commandName[1])
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err.message);
          });
      }

      break;
    case "!commands":
      client.say(
        target,
        "Available commands !emote - takes a paramater of 1-100 and spits out random emotes, !quote - displays a random quote, !talked displays - displays messages you have sent to chat, !wathctime - displays the time you have watched in minutes, !dice - rolls a dice, !weather - takes a paramater of us zip code and displays weather, !points - displays your bot points, !shoutout - takes a parameter of a twitch username and shouts them out, !gamble - takes a parameter of bot points and gambles."
      );
      break;
    case "!squid":
      client.say(target, "Squid1 Squid3 Squid2 Squid4 ");
      break;
    case "!emote":
      let leNum = commandName[1];
      let leMojiesBruv = emojiSTORM(leNum);
      let toSay = leMojiesBruv.join(" ");
      client.say(target, `${toSay}`);
      break;
    case "!quote":
      let x = quoteRoll();
      console.log(dbQuotes[x - 1]);
      client.say(
        target,
        `\"${dbQuotes[x - 1]}\" -- Someone? Maybe? Who knows!`
      );
      break;
    case "!talked":
      db.getTalked(context.username)
        .then((item) => {
          client.say(
            target,
            `${context.username} has sent ${item} messages in this channel!`
          );
        })
        .catch((err) => {
          console.log(err);
        });
      break;
    case "!clear":
      if (context.mod == true || context.badges.broadcaster == 1) {
        client.say(target, `/clear`);
      } else {
        client.say(target, `You are not a mod!`);
      }
      break;
    case "!ban":
      if (context.mod == true || context.badges.broadcaster == 1) {
        let banInfo = {
          username: commandName[1],
          bannedBy: context.username,
          reason: commandName.join(" "),
          time: new Date().toISOString(),
        };
        db.ban(banInfo)
          .then((res) => {
            client.say(target, `/ban ${commandName[0]}`);
            console.log(`banned ${commandName[1]}`);
          })
          .catch((err) => {
            console.log(err);
            client.say(target, `@${context.username} ban failed!`);
          });
      } else {
        client.say(target, `You are not a mod!`);
      }
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
      db.getUserPoints(commandName[1] || context.username)
        .then((res) => {
          client.say(
            target,
            `${commandName[1] || context.username} has ${res.points} points!`
          );
        })
        .catch((err) => {
          console.log(err);
        });
      break;
    case "!gamble":
      if (commandName[1] == undefined) {
        client.say(target, "Please include a bet value");
        return;
      }
      gamble(target, context.username, commandName[1], client);
      break;
    case "!setPoints":
      if (
        context.username.toLowerCase() == opts.identity.username.toLowerCase()
      ) {
        db.setPoints(commandName[2], commandName[1])
          .then(() => {})
          .catch((err) => {
            console.log(err.message);
          });
      }

      break;
    case "!addQuote":
      if (context.mod == true || context.badges.broadcaster == 1) {
        commandName.shift();
        let quoteString = commandName.join(" ");
        let toInsert = { quote: quoteString };
        db.addQuote(toInsert)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
        db.getQuotes()
          .then((res) => {
            res.forEach((item) => {
              dbQuotes.push(item.emote);
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
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
