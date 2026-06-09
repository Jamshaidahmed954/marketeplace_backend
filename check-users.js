import prismaClient from "./src/config/db.js";
import bcrypt from "bcrypt";

async function checkAndCreateUser() {
    try {
        // Check existing users
        const users = await prismaClient.user.findMany();
        console.log(`Found ${users.length} users in database:`);
        users.forEach(user => {
            console.log(`- ${user.email} (${user.role})`);
        });

        if (users.length === 0) {
            console.log('\nNo users found. Creating a test user...');

            // Create a test user
            const hashedPassword = await bcrypt.hash('password123', 10);
            const newUser = await prismaClient.user.create({
                data: {
                    name: 'Test User',
                    email: 'test@gmail.com',
                    password: hashedPassword,
                    role: 'BUYER',
                }
            });

            console.log('\nTest user created successfully!');
            console.log('Email: test@gmail.com');
            console.log('Password: password123');
            console.log('Role:', newUser.role);
        }

        await prismaClient.$disconnect();
    } catch (error) {
        console.error('Error:', error);
        await prismaClient.$disconnect();
        process.exit(1);
    }
}

checkAndCreateUser();
