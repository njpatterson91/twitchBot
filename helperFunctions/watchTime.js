const db = require("../model");
function watchTime(client, target, context, commandName) {
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

module.exports = watchTime;
