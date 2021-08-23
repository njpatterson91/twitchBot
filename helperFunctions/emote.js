const emojiStorm = require("./emojiStorm");

function emote(client, target) {
  let leNum = commandName[1];
  let leMojiesBruv = emojiSTORM(leNum);
  let toSay = leMojiesBruv.join(" ");
  client.say(target, `${toSay}`);
}

module.exports = emote;
