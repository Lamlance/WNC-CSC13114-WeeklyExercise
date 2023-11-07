import knex from "knex";

const db_connection = knex({
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    port: 3666,
    user: "root",
    password: "",
    database: "sakila",

  },
});

export { db_connection as MysqlClient };
