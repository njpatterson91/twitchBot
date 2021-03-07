exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").notNullable();
    table.string("username").notNullable().unique();
    table.integer("points").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
