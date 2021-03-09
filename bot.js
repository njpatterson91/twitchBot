const tmi = require("tmi.js");
const db = require("./model");
const axios = require("axios");
let apiKey = "";
const gamble = require("./helperFunctions/gamble.js");
const rollDice = require("./helperFunctions/rollDice");
const welcomed = [];
let viewers = [];

let dbEmotes = [];

let dbQuotes = [];

let dbModCommands = {};

let streamerLocation = "";

getAuth();

let opts = {
  identity: {
    username: "",
    password: "",
  },
  channels: [""],
};

const client = new tmi.client(opts);

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

  // setInterval(
  //   function () {
  //     client.say(target, "Yeet");
  //   },
  //   [2000]
  // );

  if (commandName[0] == "!addEmote") {
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
  }

  if (commandName[0] == "!addCommand") {
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
  }

  if (commandName[0] == "!commands") {
    client.say(
      target,
      "Available commands !emote - takes a paramater of 1-100 and spits out random emotes, !quote - displays a random quote, !talked displays - displays messages you have sent to chat, !wathctime - displays the time you have watched in minutes, !dice - rolls a dice, !weather - takes a paramater of us zip code and displays weather, !points - displays your bot points, !shoutout - takes a parameter of a twitch username and shouts them out, !gamble - takes a parameter of bot points and gambles."
    );
  }

  // if (commandName[0] == "!squid") {
  //   client.say(target, "Squid1 Squid3 Squid2 Squid4 ");
  // }

  if (commandName[0] == "!test") {
    console.log(dbModCommands);
    console.log(dbModCommands["hello"]);
  }

  // if (commandName[0])
  if (commandName[0] == "!emote") {
    let leNum = commandName[1];
    let leMojiesBruv = emojiSTORM(leNum);
    let toSay = leMojiesBruv.join(" ");
    client.say(target, `${toSay}`);
    console.log(context);
  }

  if (commandName[0] == "!quote") {
    let x = quoteRoll();
    console.log(dbQuotes[x - 1]);
    client.say(target, `\"${dbQuotes[x - 1]}\" -- Someone? Maybe? Who knows!`);
  }

  if (commandName[0] == "!talked") {
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
  }

  if (commandName[0] == "!clear") {
    if (context.mod == true || context.badges.broadcaster == 1) {
      client.say(target, `/clear`);
    } else {
      client.say(target, `You are not a mod!`);
    }
  }

  if (commandName[0] == "!ban") {
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
  }

  if (commandName[0] == "!watchtime") {
    console.log(commandName[1]);
    if (commandName[1] == undefined) {
      db.getWatchTime(context.username)
        .then((res) => {
          client.say(
            target,
            `${context.username} has watched for ${res.watchTime} minutes!`
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      db.getWatchTime(commandName[1])
        .then((res) => {
          client.say(
            target,
            `${commandName[1]} has watched for ${res.watchTime} minutes!`
          );
        })
        .catch((err) => {
          client.say(target, `${commandName[1]} has not been in this stream`);
          console.log(err, "yeet");
        });
    }
  }

  if (commandName[0] === "!dice") {
    const num = rollDice();
    client.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${commandName[0]} command`);
  }

  if (commandName[0] == "!weather") {
    if (context.badges.broadcaster == 1) {
      axios
        .get(
          `http://api.openweathermap.org/data/2.5/weather?zip=${streamerLocation}&units=imperial&appid=${apiKey}`
        )
        .then((res) => {
          client.say(
            target,
            `It is currently ${res.data.main.temp} degrees F where ${context.username} is!`
          );
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      axios
        .get(
          `http://api.openweathermap.org/data/2.5/weather?zip=${commandName[1]}&units=imperial&appid=${apiKey}`
        )
        .then((res) => {
          client.say(
            target,
            `It is currently ${res.data.main.temp} degrees F where ${context.username} is!`
          );
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }

  if (commandName[0] == "!points") {
    console.log(context);
    getPoints(target, context.username);
  }

  if (commandName[0] == "!gamble") {
    console.log(commandName[1]);
    if (commandName[1] == undefined) {
      client.say(target, "Please include a bet value");
      return;
    }
    gamble(target, context.username, commandName[1], client);
  }

  if (commandName[0] == "!joke") {
    client.say(target, `My life`);
  }

  if (commandName[0] == "!shoutout" || commandName[0] == "!so") {
    if (commandName[1][0] == "@") {
      let x = commandName[1].split("");
      console.log(x);
      x.shift();
      client.say(target, `Go and check out https://twitch.tv/${x.join("")}`);
    } else {
      client.say(
        target,
        `Go and check out https://twitch.tv/${commandName[1]}`
      );
    }
  }

  if (commandName[0] == "!addquote") {
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
  }
  if (dbModCommands[commandName[0]] != undefined) {
    client.say(target, dbModCommands[commandName[0]]);
  }
}

function getPoints(target, user) {
  db.getUserPoints(user)
    .then((res) => {
      client.say(target, `${user} has ${res.points} points!`);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getAuth() {
  db.getCreds()
    .then((res) => {
      opts.identity.username = res[0].value;
      opts.identity.password = res[1].value;
      opts.channels[0] = res[2].value;
      apiKey = res[3].value;
      streamerLocation = res[4].value;
    })
    .catch((err) => {
      console.log(err);
    });
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
