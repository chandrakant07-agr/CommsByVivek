import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from './models/admin.model.js';

// Load environment variables
dotenv.config();

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'test';

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(MONGODB_URI, {
            dbName: DB_NAME,
        });
        console.log('✅ MongoDB successfully connected!');
        console.log(`📜 Host: ${connection.connection.host}`);
        console.log(`📜 Port: ${connection.connection.port}`);
        console.log(`📜 Database: ${connection.connection.name}\n`);
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    }
};

const createDefaultAdmin = async () => {
    try {
        const adminName = process.env.ADMIN_NAME || "Admin";
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        // Validate environment variables
        if(!adminEmail || !adminPassword) {
            console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file');
            process.exit(1);
        }

        console.log('🔍 Checking if admin user already exists...');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: adminEmail });

        if(existingAdmin) {
            console.log('⚠️  Admin user already exists with this email:', adminEmail);
            console.log('📜 Admin Name:', existingAdmin.fullName);
            console.log('📜 Created At:', existingAdmin.createdAt);
            console.log('\n✅ No action needed. Admin user already seeded.');
            return;
        }

        console.log('🌱 Creating default admin user...');

        // Create new admin user
        const newAdmin = await Admin.create({
            fullName: adminName,
            email: adminEmail,
            password: adminPassword,
            role: "Admin"
        });

        if(!newAdmin) {
            throw new Error('Failed to create admin user');
        }

        console.log('✅ Default admin user created successfully!');
        console.log('📜 Name:', newAdmin.fullName);
        console.log('📜 Email:', newAdmin.email);
        console.log('📜 Role:', newAdmin.role);
        console.log('📜 ID:', newAdmin._id);

    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    console.log('🚀 Starting database seeding process...\n');

    try {
        // Connect to database
        await connectDB();

        // Create default admin
        await createDefaultAdmin();

        console.log('\n🎉 Seeding completed successfully!');

    } catch (error) {
        console.error('\n❌ Seeding failed:', error.message);
        process.exit(1);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed.');
        process.exit(0);
    }
};

// Run seeder
seedDatabase();
