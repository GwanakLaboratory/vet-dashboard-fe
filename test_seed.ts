
import { seedDatabase } from "./server/utils/seed";
import { MemStorage } from "./server/storage";
import * as fs from 'fs';

async function test() {
    fs.writeFileSync('test_result.txt', "Testing seedDatabase...\n");
    const storage = new MemStorage();
    try {
        await seedDatabase(storage);
        fs.appendFileSync('test_result.txt', "Seeding successful!\n");
        const patients = await storage.getAllPatients();
        fs.appendFileSync('test_result.txt', `Patients count: ${patients.length}\n`);
    } catch (error) {
        fs.appendFileSync('test_result.txt', `Seeding failed: ${error}\n`);
    }
}

test();
