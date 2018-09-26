const kafka = require('kafka-node');
const ConsumerGroup = require('kafka-node').ConsumerGroup;

const mongoClient = require('./mongoClient');


const client = new kafka.KafkaClient({kafkaHost: '127.0.0.1:2181'});

var consumerOptions = {
  host: '127.0.0.1:2181',
  groupId: 'ExampleTestGroup',
  sessionTimeout: 15000,
  protocol: ['roundrobin'],
  fromOffset: 'earliest' // equivalent of auto.offset.reset valid values are 'none', 'latest', 'earliest'
};

var topics = ['twitter_tweets'];

var consumerGroup = new ConsumerGroup(Object.assign({id: 'consumer1'}, consumerOptions), topics);
//consumerGroup.on('error', onError);
//consumerGroup.on('message', onMessage);




 
//const consumer = new kafka.HighLevelConsumer(client, topics, options);
 
consumerGroup.on("message", function(message) {
    let value = JSON.parse(message.value);
    
    let tweet = {
        'text': value.text,
        'created_at': value.created_at,
        'user_screen_name' : value.user.screen_name,
        'user_name': value.user.name
    }

    console.log(JSON.stringify(tweet));

    mongoClient.insertTweet(tweet);
});
 
consumerGroup.on("error", function(err) {
    console.log("error", err);
});

const shutdown = () => {
    mongoClient.shutdown();
    console.log('Mongo connection closed');
    consumerGroup.close(true, (err) => {
        console.log(err);
        process.exit();
    });
    console.log('Kafka consumer closed');
    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
