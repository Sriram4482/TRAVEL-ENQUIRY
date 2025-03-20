const { MongoClient } = require('mongodb');

// Replace <db_password> with your actual database password
const uri = 'mongodb+srv://22a31a4482:Inevirs@1234@travelcluster.l8bxf.mongodb.net/travelDB?retryWrites=true&w=majority';

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
