import { connectDatabase } from "../config/db.js";
import { AdminUser } from "../models/AdminUser.js";

const required = ["ADMIN_SEED_NAME", "ADMIN_SEED_EMAIL", "ADMIN_SEED_PASSWORD"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`Missing required admin seed variables: ${missing.join(", ")}`);
  console.error("Example: ADMIN_SEED_NAME=\"Magdalene\" ADMIN_SEED_EMAIL=\"admin@example.com\" ADMIN_SEED_PASSWORD=\"...\" npm run seed:admin");
  process.exit(1);
}

if (process.env.ADMIN_SEED_PASSWORD.length < 12) {
  console.error("ADMIN_SEED_PASSWORD must be at least 12 characters.");
  process.exit(1);
}

await connectDatabase();

const email = process.env.ADMIN_SEED_EMAIL.toLowerCase();
const existingAdmin = await AdminUser.findOne({ email });

if (existingAdmin) {
  console.log(`Admin user already exists for ${email}.`);
  process.exit(0);
}

await AdminUser.create({
  name: process.env.ADMIN_SEED_NAME,
  email,
  role: process.env.ADMIN_SEED_ROLE || "admin",
  passwordHash: await AdminUser.hashPassword(process.env.ADMIN_SEED_PASSWORD),
  active: true
});

console.log(`Created admin user for ${email}.`);
process.exit(0);
