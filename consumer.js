require('./constants');
require('./db');

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId  : 'my-app-consumer',
    brokers   : ['localhost:9092'],
    logCreator: require('./kafka-logger')
});

const topicName      = TOPIC_NAME;
const consumerNumber = process.argv[2] || '1';

const logger = require('./logger')(`CON#${consumerNumber}`, 'cyan');

const processConsumer = async () => {
    const paymentsConsumer = kafka.consumer({ groupId: 'payments' });
    await Promise.all([
        paymentsConsumer.connect(),
    ]);

    await Promise.all([
        await paymentsConsumer.subscribe({ topic: topicName, fromBeginning: true }),
    ]);

    let paymentCounter = 1;
    await paymentsConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            logMessage(paymentCounter, `paymentsConsumer#${consumerNumber}`, topic, partition, message);
            paymentCounter++;
            try {
                let transaction = JSON.parse(message.value);
                let t           = await TransactionsModel.findAll({
                    where: { id: transaction['id'] }
                });
                if (!t || !t.length) {
                    throw "Transaction not found!!";
                }
                t = t[0];
                if (t['status'] != 'pending') {
                    throw "######### WARNING:: TRYING RE-EXECUTION OF PAYMENT #########";
                }
                await TransactionsModel.update({ status: 'success' }, { where: { id: transaction['id'] }});
                await new Promise((resolve) => setTimeout(() => resolve(logger.info('completed execution of ', transaction['id'])), 3000));
                return true;
            } catch (e) {
                if (e.includes('WARNING')) {
                    logger.warn(e);
                } else {
                    logger.error(e);
                }
                if (!["Transaction not found!!", "######### WARNING:: TRYING RE-EXECUTION OF PAYMENT #########"].includes(e)) {
                    throw e;
                }
                return false;
            }
        },
    });

    PROCESS_EXIT_SIGNALS.forEach(ev => {
        logger.info(`[${ev}] Setting`);
        process.once(ev, () => {
            logger.info(`[${ev}] Received`);
            paymentsConsumer.disconnect()
            setTimeout(() => process.exit(0), 3000);
        });
    });
};

/**
 *
 * @function logMessage
 * @description Logs Kafka Messages to the console  
 * @param message {KafkaMessage}
 */
const logMessage = (counter, consumerName, topic, partition, message) => {
    logger.info(`Message Received: #${counter} :: [${topic}] #${partition}`, {
        offset : message.offset,
        headers: message.headers,
        value  : message.value.toString()
    });
};

processConsumer().catch(e => logger.error(e));
