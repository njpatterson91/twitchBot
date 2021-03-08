const db = require("./dbConfig");

module.exports = {
  getUserPoints,
  giveUserPoints,
  getAllUsers,
  getWatchTime,
  getCreds,
  getEmotes,
  addEmote,
  addQuote,
  getQuotes,
  chatLog,
  getTalked,
  getModCommands,
  addModCommands,
};

async function getUserPoints(username) {
  return await db("users").where("username", username).first();
}
async function getCreds() {
  return await db("auth");
}
async function getAllUsers() {
  return await db("users");
}

async function giveUserPoints(points, username) {
  let x = await db("users").where("username", username).first();
  //console.log(x);
  let newUser = {
    username: username,
    points: 100,
    watchTime: 1,
  };
  if (x == undefined) {
    await db("users").insert(newUser);
  } else {
    let newPoints = {
      username: username,
      points: x.points + points,
      watchTime: x.watchTime + 1,
    };
    await db("users").where("username", username).update(newPoints);
  }
}

async function getWatchTime(username) {
  return db("users").where("username", username).first();
}

async function addEmote(emote) {
  return await db("emotes").insert(emote);
}

async function addQuote(quote) {
  return await db("quotes").insert(quote);
}

async function getEmotes() {
  return await db("emotes");
}

async function getQuotes() {
  return await db("quotes");
}

async function chatLog(message) {
  return await db("chatLog").insert(message);
}

async function getTalked(username) {
  let x = await db("chatLog").where("user", username);
  return x.length;
}

async function getModCommands() {
  return await db("modCreateCommand");
}

async function addModCommands(command) {
  return await db("modCreateCommand").insert(command);
}
