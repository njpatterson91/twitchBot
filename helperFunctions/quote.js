function quote(client, target, dbQuotes) {
  let x = quoteRoll();
  console.log(dbQuotes[x - 1]);
  client.say(target, `\"${dbQuotes[x - 1]}\" -- Someone? Maybe? Who knows!`);
}

module.exports = quote;
