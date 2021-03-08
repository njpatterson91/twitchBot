exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("table_name")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("table_name").insert([
        { id: 1, name: "username", value: "" },
        { id: 2, name: "password", value: "" },
        { id: 3, name: "channel", value: "" },
        { id: 3, name: "weather", value: "" },
      ]);
    });
};
