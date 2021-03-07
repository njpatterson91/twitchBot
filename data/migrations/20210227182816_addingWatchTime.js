exports.up = function (knex) {
    return knex.schema.table("users", (table) => {
      table.integer("watchTime");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.table("users", (table) => {
        table.dropColumn('watchTime')
    });
  };
