const db = require("../model");

function talked(context, client, target) {
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

module.exports = talked;
