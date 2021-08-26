exports.up = function (knex) {
  return knex.schema.createTable("emotes", (table) => {
    table.increments("id").notNullable();
    table.string("emote").unique();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("emotes");
};
