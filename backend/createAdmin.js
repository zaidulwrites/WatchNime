    // backend/createAdmin.js
    // This script creates an admin user for the Turso database
    // Run it once using: node createAdmin.js

    import dotenv from 'dotenv';
    import bcrypt from 'bcryptjs';
    import { createClient } from '@libsql/client';
    import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

    dotenv.config(); // Load .env variables

    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

    if (!tursoUrl || !tursoAuthToken) {
      console.error('ERROR: TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is not set in your .env file.');
      process.exit(1);
    }

    const db = createClient({
      url: tursoUrl,
      authToken: tursoAuthToken,
    });

    async function createAdminUser() {
      const username = 'zayn7488'; // Your desired admin username
      const password = '123@zayn@7488'; // Your desired admin password (CHANGE THIS IN PRODUCTION!)
      const role = 'admin';

      try {
        // Enable foreign keys for this connection (important for SQLite)
        await db.execute("PRAGMA foreign_keys = ON;");

        // Check if admin user already exists
        const userExists = await db.execute({
          sql: "SELECT * FROM User WHERE username = ? LIMIT 1;",
          args: [username]
        });

        if (userExists.rows.length > 0) {
          console.log(`Admin user '${username}' already exists. Skipping creation.`);
          return;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin user
        const id = uuidv4();
        const createdAt = new Date().toISOString();
        const updatedAt = new Date().toISOString();

        await db.execute({
          sql: "INSERT INTO User (id, username, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?);",
          args: [id, username, hashedPassword, role, createdAt, updatedAt]
        });

        console.log(`Admin user '${username}' created successfully with role '${role}'.`);
        console.log(`Use Username: '${username}' and Password: '${password}' to log in to the admin panel.`);
      } catch (error) {
        console.error('Error creating admin user:', error);
      } finally {
        // In Node.js, libsql client doesn't typically need explicit closing like a pool.
        // It manages connections internally.
      }
    }

    createAdminUser();
    