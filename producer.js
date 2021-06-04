require('./constants');
require('./db');

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers : ['localhost:9092']
});

const topicName = TOPIC_NAME;

const msg = JSON.stringify({ bank_name: 1, paymentID: 1 });

const processProducer  = async () => {
    const producer = kafka.producer();
    await producer.connect();
    for (let i = 0; i < 100; i++) {
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
            amount : Math.ceil(Math.random() * 6),
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
        console.log('[SIGINT] Received');
        producer.disconnect();
    });

    process.on('exit', () => {
        console.log('[exit] Received');
        producer.disconnect();
    })

};

processProducer().then(() => {
    console.log('done');
    process.exit();
});

// const express = require('express');

// const app = express();

// app.listen(3000, () => console.log('Server running on port: 3000'));