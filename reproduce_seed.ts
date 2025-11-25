import { seedDatabase } from './server/utils/seed';
import { MemStorage } from './server/storage';

async function run() {
    console.log("Starting reproduction script...");
    const storage = new MemStorage();
    try {
        await seedDatabase(storage);
        console.log("Seeding completed successfully.");
        const patients = await storage.getAllPatients();
        console.log(`Patients count: ${patients.length}`);
        if (patients.length === 0) {
            console.error("❌ No patients found after seeding!");
        } else {
            console.log("✅ Patients found:", patients.map(p => p.name));
        }
    } catch (error) {
        console.error("❌ Seeding failed:", error);
    }
}

run();
