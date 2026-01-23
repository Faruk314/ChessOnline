import mysql from "mysql2/promise";
import { ConnectionString } from "connection-string";
import dotenv from "dotenv";
dotenv.config();

async function initDb() {
  console.log("Initializing database...");
  try {
    const dsn = new ConnectionString(process.env.DATABASE_URL);
    const connection = await mysql.createConnection({
      host: dsn.hostname,
      user: dsn.user,
      password: dsn.password,
      database: dsn.path && dsn.path[0] ? dsn.path[0] : "chess",
      port: dsn.port,
      multipleStatements: true
    });

    console.log("Connected to MySQL.");

    // Create users table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`userId\` int NOT NULL AUTO_INCREMENT,
        \`userName\` varchar(50) NOT NULL,
        \`image\` varchar(255) DEFAULT NULL,
        \`password\` varchar(255) NOT NULL,
        \`email\` varchar(100) NOT NULL,
        PRIMARY KEY (\`userId\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

    // Create friend_requests table
    const createFriendRequestsTable = `
      CREATE TABLE IF NOT EXISTS \`friend_requests\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`sender\` int NOT NULL,
        \`receiver\` int NOT NULL,
        \`status\` enum('pending','accepted') NOT NULL,
        \`created_at\` datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`fk_friend_request_sender\` (\`sender\`),
        KEY \`fk_friend_request_receiver\` (\`receiver\`),
        CONSTRAINT \`fk_friend_request_receiver\` FOREIGN KEY (\`receiver\`) REFERENCES \`users\` (\`userId\`) ON DELETE CASCADE,
        CONSTRAINT \`fk_friend_request_sender\` FOREIGN KEY (\`sender\`) REFERENCES \`users\` (\`userId\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

    // Create invites table
    const createInvitesTable = `
      CREATE TABLE IF NOT EXISTS \`invites\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`sender\` int NOT NULL,
        \`receiver\` int NOT NULL,
        \`created_at\` datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`fk_invites_sender\` (\`sender\`),
        KEY \`fk_invites_receiver\` (\`receiver\`),
        CONSTRAINT \`fk_invites_receiver\` FOREIGN KEY (\`receiver\`) REFERENCES \`users\` (\`userId\`) ON DELETE CASCADE,
        CONSTRAINT \`fk_invites_sender\` FOREIGN KEY (\`sender\`) REFERENCES \`users\` (\`userId\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

    await connection.execute(createUsersTable);
    console.log("Users table checked/created.");

    await connection.execute(createFriendRequestsTable);
    console.log("Friend Requests table checked/created.");

    await connection.execute(createInvitesTable);
    console.log("Invites table checked/created.");

    await connection.end();
    console.log("Database initialization complete.");

  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}

initDb();
