const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const url = 'mongodb+srv://romeo:romello1@mycluster.ficth39.mongodb.net/?retryWrites=true&w=majority&appName=mycluster';
const dbName = 'Stock';
const collectionName = 'PublicCompanies';

app.use(express.static('public'));

// Home view route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Process view route
app.get('/process', async (req, res) => {
    const searchTerm = req.query.searchTerm;
    const searchType = req.query.searchType;

    try {
        const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Construct query based on search type
        const query = {};
        if (searchType === 'ticker') {
            query.stockTicker = searchTerm;
        } else if (searchType === 'company') {
            query.companyName = searchTerm;
        }

        // Find matching documents in the collection
        const result = await collection.find(query).toArray();

        // Display search results in the console
        console.log('Search Results:', result);

        // Close MongoDB connection
        client.close();

        // Send the search results as JSON
        res.json(result);
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        res.status(500).send('Error connecting to database');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
