import knex from "knex";

const db_connection = knex({
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
<<<<<<< Updated upstream
    port: 3666,
    user: "localhost",
    password: "12345",
    database: "sakila_db",
=======
    port: 3306,
    user: "root",
    password: "",
    database: "actor",
>>>>>>> Stashed changes
  },
});

export { db_connection as MysqlClient };
