function rollDice() {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

module.exports = rollDice;
