import { connectDatabase } from "../config/db.js";
import { CodeOfResonanceEntry } from "../models/CodeOfResonanceEntry.js";
import { defaultCodeOfResonanceEntries } from "./defaultCodeOfResonanceData.js";

await connectDatabase();

let createdCount = 0;
let updatedCount = 0;

for (const entry of defaultCodeOfResonanceEntries) {
  const result = await CodeOfResonanceEntry.updateOne(
    { slug: entry.slug },
    { $setOnInsert: entry },
    { upsert: true }
  );

  if (result.upsertedCount > 0) {
    createdCount += 1;
  } else {
    updatedCount += 1;
  }
}

console.log(`Code of Resonance seed complete. Created: ${createdCount}. Existing: ${updatedCount}.`);
process.exit(0);
