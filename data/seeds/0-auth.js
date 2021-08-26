exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("auth")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("auth").insert([
        { id: 1, name: "username", value: "" },
        { id: 2, name: "password", value: "" },
        { id: 3, name: "channel", value: "" },
        { id: 4, name: "weather", value: "" },
        { id: 5, name: "location", value: "" },
      ]);
    });
};
