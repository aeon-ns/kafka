require('./constants');
require('./db');

const { Kafka } = require('kafkajs');
const logger = require('./logger')('CODE', 'cyan');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
    logCreator: require('./kafka-logger')
});

const topicName = TOPIC_NAME;

const msg = JSON.stringify({ bank_name: 1, paymentID: 1 });

const processProducer = async () => {
    const producer = kafka.producer();
    await producer.connect();
    for (let i = 0; i < 1; i++) {
        let bank_name;
        switch (i % 4) {
            default:
                bank_name = 'ICICI';
                break;
            case 0:
                bank_name = 'HDFC';
                break;
            case 1:
                bank_name = 'KOTAK';
                break;
            case 2:
                bank_name = 'YES';
                break;
        }
        let transaction = await TransactionsModel.create({
            amount: Math.ceil(Math.random() * 6),
            bank_name: bank_name,
        })
        await producer.send({
            topic: topicName,
            messages: [
                { value: JSON.stringify(transaction), key: bank_name },
            ],
        });
    }

    process.on('SIGINT', () => {
        logger.info('[SIGINT] Received');
        producer.disconnect();
    });

    process.on('exit', () => {
        logger.info('[exit] Received');
        producer.disconnect();
    })

};

processProducer().then(() => {
    logger.info('done');
    process.exit();
}).catch(e => logger.error(e));

// const express = require('express');

// const app = express();

// app.listen(3000, () => logger.info('Server running on port: 3000'));