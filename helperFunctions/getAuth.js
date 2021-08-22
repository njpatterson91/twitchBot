const db = require("../model");
function getAuth() {
  let opts = [{}];
  db.getCreds()
    .then((res) => {
      opts[0].identity.username = res[0].value;
      opts[0].identity.password = res[1].value;
      opts[0].channels[0] = res[2].value;
      opts[1] = res[3].value;
      opts[2] = res[4].value;
    })
    .catch((err) => {
      console.log(err);
    });
  return opts;
}

module.exports = getAuth;
