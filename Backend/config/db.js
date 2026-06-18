import mongoose from "mongoose";
import User from "../models/User.js";

/**
 * Connect to MongoDB using Mongoose.
 * Reads MONGO_URI from environment variables.
 */
const connectDB = async () => {
  try {
    // Disable query buffering so database calls throw immediately if connection is down
    mongoose.set("bufferCommands", false);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`\n======================================================`);
    console.log(` MongoDB Connected Successfully!`);
    console.log(` Host: ${conn.connection.host}`);
    console.log(` Database: ${conn.connection.name}`);
    console.log(`======================================================\n`);

    // Seed Super Admin user if it does not exist
    const adminEmail = "admin@patilcybershield.com";
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: "Super Admin",
        email: adminEmail,
        password: "P@tilcybershield1207",
        role: "Super Admin",
        status: "Active",
      });
      console.log(`[Seed] Super Admin user (${adminEmail}) seeded successfully!\n`);
    }
  } catch (error) {
    console.error(`\n======================================================`);
    console.error(` MongoDB Connection Error:`);
    console.error(` Error: ${error.message}`);
    console.error(`======================================================\n`);
  }
};

export default connectDB;
