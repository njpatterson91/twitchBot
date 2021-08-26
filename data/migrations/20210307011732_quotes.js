exports.up = function (knex) {
  return knex.schema.createTable("quotes", (table) => {
    table.increments("id").notNullable();
    table.string("quote").unique();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("quotes");
};
