const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'tweets';

let client;

const initialize = async () => {
    //connect to DB
    if (!client) {
        client = await MongoClient.connect(url);
        console.log("Connected correctly to server");
    }
};

const insertTweet = async (tweet) => {
    //let client;
    try {
        //client = await MongoClient.connect(url);
        //console.log("Connected correctly to server");
        await initialize();

        const db = client.db(dbName);
    
        // Insert a single document
        let r = await db.collection('tweets').insertOne(tweet);

        console.log('Entry created' + JSON.stringify(r));
      } catch (err) {
        console.log(err.stack);
      }

    // Close connection
    //client.close();
};

const shutdown = () => {
    if (client) {
        client.close();
    }
}

module.exports = {insertTweet, shutdown};