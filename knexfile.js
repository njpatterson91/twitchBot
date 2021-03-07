const sharedConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  migrations: { directory: "./data/migrations" },
  seeds: { directory: "./data/seeds" },
};

module.exports = {
  development: {
    ...sharedConfig,
    connection: {
      filename: "./data/database.db3",
    },
  },
  testing: {
    client: "pg",
    connection:
      "postgres://nohatucv:S_t567zbU-XPUAAlHy23I63WRhS7cNz2@ziggy.db.elephantsql.com:5432/nohatucv",
    migrations: {
      directory: "./data/migrations",
    },
    seeds: { directory: "./data/seeds" },
  },
  production: {
    client: "pg",
    connection: "",
    migrations: {
      directory: "./data/migrations",
    },
    seeds: { directory: "./data/seeds" },
  },
};
