const axios = require("axios");
function weather(
  client,
  target,
  context,
  commandName,
  apiKey,
  streamerLocation
) {
  if (context.username == "deathxxscythe") {
    axios
      .get(
        `http://api.openweathermap.org/data/2.5/weather?zip=${streamerLocation}&units=imperial&appid=${apiKey}`
      )
      .then((res) => {
        client.say(
          target,
          `It is currently ${res.data.main.temp} degrees F where ${context.username} is!`
        );
      })
      .catch((err) => {
        console.log(err.message);
      });
  } else {
    axios
      .get(
        `http://api.openweathermap.org/data/2.5/weather?zip=${commandName[1]}&units=imperial&appid=${apiKey}`
      )
      .then((res) => {
        client.say(
          target,
          `It is currently ${res.data.main.temp} degrees F where ${context.username} is!`
        );
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
}

module.exports = weather;
