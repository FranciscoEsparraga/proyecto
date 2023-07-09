const mysql = require("mysql2/promise");
const chalk = require("chalk");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

let pool;

//Establecer conexión con la BBDD
const getConnection = async () => {
  try {
    if (!pool) {
      pool = await mysql.createPool({
        connectionLimit: 10,
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        timezone: "Z",
      });
    }
    return await pool.getConnection();
  } catch (error) {
    console.error(chalk.red(error));
    throw new Error(`Error connecting to MySQL`);
  }
};

module.exports = { getConnection };
