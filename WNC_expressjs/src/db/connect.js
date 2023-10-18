import knex from "knex";

const db_connection = knex({
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    port: 33060,
    user: "root",
    password: "12345",
    database: "sakila",
  },
});

export { db_connection as MysqlClient };
