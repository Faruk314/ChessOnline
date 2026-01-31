import mysql from "mysql2/promise";
import { ConnectionString } from "connection-string";
import "../loadEnv";

const dsn = new ConnectionString(process.env.DATABASE_URL);

const connectionPool = mysql.createPool({
  host: dsn.hostname,
  user: dsn.user,
  password: dsn.password,
  database: dsn.path && dsn.path[0] ? dsn.path[0] : "chess",
  port: dsn.port,
  waitForConnections: true,
  connectionLimit: 100,
  maxIdle: 10,
  idleTimeout: 3000,
  queueLimit: 0,
});

export default async function query(sql: string, params: any[]) {
  try {
    const [results] = await connectionPool.execute(sql, params);

    return results;
  } catch (err) {
    console.log("My sql connection error:" + err);
    throw new Error("Database connection error");
  }
}
