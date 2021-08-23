const db = require("../model");

function ban(client, target, context, commandName) {
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

module.exports = ban;
