exports.up = function (knex) {
  return knex.schema.createTable("auth", (table) => {
    table.increments("id").notNullable();
    table.string("name").unique();
    table.string("value");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("auth");
};
