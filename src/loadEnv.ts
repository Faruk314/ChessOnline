import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
let envPath = path.resolve(process.cwd(), envFile);

// Check current directory
if (!fs.existsSync(envPath)) {
  // Check parent directory
  let parentPath = path.resolve(process.cwd(), "..", envFile);
  if (fs.existsSync(parentPath)) {
    envPath = parentPath;
  } else {
    // Check grandparent directory (likely project root from dist-backend/server)
    parentPath = path.resolve(process.cwd(), "../..", envFile);
    if (fs.existsSync(parentPath)) {
        envPath = parentPath;
    } else {
         // Check great-grandparent directory just in case
        parentPath = path.resolve(process.cwd(), "../../..", envFile);
        if (fs.existsSync(parentPath)) {
            envPath = parentPath;
        }
    }
  }
}

console.log(`Loading environment from ${envPath}`);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("Error loading .env file:", result.error);
}
