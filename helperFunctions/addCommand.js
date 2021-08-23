const db = require("../model");

function addCommand(client, target, context, commandName, dbModCommands) {
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
module.exports = addCommand;
