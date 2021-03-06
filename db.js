const { Sequelize } = require('sequelize');
const logger        = require('./db-logger');

const DB_CONFIG = {
    USER   : 'root',
    PASS   : 'root',
    DIALECT: 'mysql',
    HOST   : 'localhost',
    PORT   : '3306'
};

global.Sql = new Sequelize('payments_db', DB_CONFIG.USER, DB_CONFIG.PASS, {
    dialect: DB_CONFIG.DIALECT,
    host   : DB_CONFIG.HOST,
    port   : DB_CONFIG.PORT,
    pool   : {
        max : 2,
        min : 1,
        idle: 10000
    },
    logQueryParameters: true,
    logging: msg => logger.info(msg)
});

[
    'transactions'
].forEach(model => require(`./models/${model}`));