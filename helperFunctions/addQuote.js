const db = require("../model");

function addQuote(context, commandName, dbQuotes) {
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

module.exports = addQuote;
