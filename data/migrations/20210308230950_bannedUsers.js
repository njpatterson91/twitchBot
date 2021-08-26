exports.up = function (knex) {
  return knex.schema.createTable("bannedUsers", (table) => {
    table.increments("id").notNullable();
    table.string("username");
    table.string("bannedBy");
    table.string("reason");
    table.string("time");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("bannedUsers");
};
