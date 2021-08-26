const db = require("../model");

function points(context, client, target) {
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
}

module.exports = points;
