exports.up = function (knex) {
  return knex.schema.createTable("modCreateCommand", (table) => {
    table.increments("id").notNullable();
    table.string("commandName");
    table.string("response");
    table.string("createdBy");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("modCreateCommand");
};
