function commands(client, target) {
  client.say(
    target,
    "Available commands !emote - takes a paramater of 1-100 and spits out random emotes, !quote - displays a random quote, !talked displays - displays messages you have sent to chat, !wathctime - displays the time you have watched in minutes, !dice - rolls a dice, !weather - takes a paramater of us zip code and displays weather, !points - displays your bot points, !shoutout - takes a parameter of a twitch username and shouts them out, !gamble - takes a parameter of bot points and gambles."
  );
}

module.exports = commands;
