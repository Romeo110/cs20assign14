const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;
const url = 'mongodb+srv://romeo:romello1@mycluster.ficth39.mongodb.net/?retryWrites=true&w=majority&appName=mycluster';
const dbName = 'Stock';
const collectionName = 'PublicCompanies';

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/process', (req, res) => {
    const searchTerm = req.query.searchTerm;
    const searchType = req.query.searchType;

    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
        if (err) {
            console.error('Error connecting to MongoDB:', err);
            return;
        }

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const query = {};
        if (searchType === 'ticker') {
            query.stockTicker = searchTerm;
        } else if (searchType === 'company') {
            query.companyName = searchTerm;
        }

        collection.find(query).toArray((err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                client.close();
                return;
            }

            console.log('Search Results:', result);
            res.send('<pre>' + JSON.stringify(result, null, 2) + '</pre>');
            client.close();
        });
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
