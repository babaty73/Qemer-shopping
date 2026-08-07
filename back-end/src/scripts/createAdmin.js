import "dotenv/config";
import mongoose from "mongoose";
import { Admin } from "../models/Admin.js";
import { env } from "../config/env.js";

/**
 * One-time setup script. There is no public admin registration endpoint by
 * design (the brief specifies "Admin Login only") — run this once against
 * your database to create the first admin account:
 *
 *   npm run seed:admin -- <username> <email> <password>
 */
async function run() {
  const [username, email, password] = process.argv.slice(2);

  if (!username || !email || !password) {
    console.error("Usage: npm run seed:admin -- <username> <email> <password>");
    process.exit(1);
  }

  await mongoose.connect(env.mongoUri);

  const existing = await Admin.findOne({
    $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
  });

  if (existing) {
    console.error("An admin with that username or email already exists.");
    await mongoose.disconnect();
    process.exit(1);
  }

  const admin = new Admin({ username, email });
  await admin.setPassword(password);
  await admin.save();

  console.log(`Admin created: ${admin.username} <${admin.email}>`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
