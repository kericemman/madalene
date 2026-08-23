import { connectDatabase } from "../config/db.js";
import { Offer } from "../models/Offer.js";
import { offers } from "./defaultAssessmentData.js";

await connectDatabase();

for (const offer of offers) {
  await Offer.findOneAndUpdate({ slug: offer.slug }, offer, { upsert: true, new: true });
}

// Keep historic references intact while retiring offers that no longer belong in the public catalogue.
await Offer.updateMany(
  { slug: { $in: ["discern-intensive", "trusted-choice-mentorship"] }, active: true },
  { active: false }
);

console.log(`Upserted ${offers.length} public offers.`);
process.exit(0);
