const { MongoClient } = require('mongodb');

// Replace <db_password> with your actual database password
const uri = MONGO_URI='mongodb+srv://sriramsid2004:1PSMSe0gb8vp42dp@myconnections.domlh.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=MYCONNECTIONS';

const client = new MongoClient(uri); // Removed deprecated options

async function run() {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log("Connected to MongoDB Atlas!");

        // Make the appropriate DB calls here
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    } finally {
        // Close the connection (optional if you plan to run more queries)
        await client.close();
    }
}

run().catch(console.error);
