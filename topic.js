require('./constants');

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});

const topicName = TOPIC_NAME;
const numPartitions = 20;

const process  = async () => {
    const admin = kafka.admin();
    await admin.connect();
    await admin.createTopics({
        topics: [{
            topic            : topicName,
            numPartitions    : numPartitions,
            replicationFactor: 1
        }],
    });
    console.log(`Topic :: ${topicName} Partitions:: ${numPartitions} `);
    await admin.disconnect();
};

process().then(() => console.log('done'));