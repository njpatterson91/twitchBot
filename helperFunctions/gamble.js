const db = require("../model");
const rollDice = require("./rollDice");

function gamble(target, user, bet, client) {
  let availablePoints = 0;
  db.getUserPoints(user)
    .then((res) => {
      availablePoints = res.points;
      // Negative check (think validation) first, and exit early if conditions for further logic are not met
      if (availablePoints < bet) {
        client.say(
          target,
          `You only have ${availablePoints} your bet is too high!`
        );
        return;
      }

      const computer = rollDice();
      const player = rollDice();
      if (computer > player) {
        client.say(
          target,
          `The house rolled a ${computer} ${user} rolled a ${player} ${user} lost!`
        );
        db.giveUserPoints(bet * -1, user)
          .then(() => {})
          .catch((err) => {
            console.log(err.message);
          });
        // Returning since nothing else should happen
        return;
      }

      // No need for else's really
      if (computer == player) {
        client.say(
          target,
          `The house rolled a ${computer} ${user} rolled a ${player} ${user} tied!`
        );
        return;
      }

      // This is basically the default or fallback logic if no other checks exit early
      client.say(
        target,
        `The house rolled a ${computer} ${user} rolled a ${player} ${user} won!`
      );

      db.giveUserPoints(bet * 2, user)
        .then(() => {})
        .catch((err) => {
          console.log(err.message);
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = gamble;
