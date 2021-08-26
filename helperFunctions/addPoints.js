const db = require("../model");

function addPoints(context, opts) {
  if (context.username.toLowerCase() == opts.identity.username.toLowerCase()) {
    db.giveUserPoints(commandName[2], commandName[1])
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
}

module.exports = addPoints;
