exports.up = function (knex) {
  return knex.schema.createTable("chatLog", (table) => {
    table.increments("id").notNullable();
    table.string("user");
    table.string("message");
    table.string("timeStamp");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("chatLog");
};
