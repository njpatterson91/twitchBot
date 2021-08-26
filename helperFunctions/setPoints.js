const db = require("../model");

function setPoints(context, opts) {
  if (context.username.toLowerCase() == opts.identity.username.toLowerCase()) {
    db.setPoints(commandName[2], commandName[1])
      .then(() => {})
      .catch((err) => {
        console.log(err.message);
      });
  }
}

module.exports = setPoints;
