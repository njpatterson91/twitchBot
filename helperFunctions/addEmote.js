const db = require("../model");

function addEmote(context, commandName) {
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

module.exports = addEmote;
