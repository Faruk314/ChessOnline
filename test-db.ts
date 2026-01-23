import mysql from "mysql2/promise";
import { ConnectionString } from "connection-string";
import dotenv from "dotenv";
dotenv.config();

async function testConnection() {
  console.log("Testing connection with URL:", process.env.DATABASE_URL);
  try {
      const dsn = new ConnectionString(process.env.DATABASE_URL);
      const connection = await mysql.createConnection({
        host: dsn.hostname,
        user: dsn.user,
        password: dsn.password,
        database: dsn.path && dsn.path[0] ? dsn.path[0] : "chess",
        port: dsn.port,
      });
    console.log("Successfully connected to MySQL!");
    await connection.end();
  } catch (error) {
    console.error("Failed to connect:", error);
  }
}

testConnection();
