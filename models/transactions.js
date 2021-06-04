const { DataTypes } = require("sequelize");
const logger        = require('../logger')('SQL', 'blue');

if (!global.Sql) {
    throw "Sequelize connection must be initiated before importing this file."
}

const Transactions = Sql.define('transactions', {
    id: {
        type         : DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey   : true,
    },
    amount: {
        type        : DataTypes.DOUBLE,
        defaultValue: 0,
    },
    bank_name: {
        type        : DataTypes.ENUM('HDFC', 'KOTAK', 'YES', 'ICICI'),
        defaultValue: null,
    },
    status: {
        type        : DataTypes.ENUM('pending', 'inprogress', 'success', 'failed'),
        defaultValue: 'pending',
    }
}, {
    freezeTableName: true
});

Transactions.sync({ force: false })
    .then(() => logger.info('Transactions Model Synced'))
    .catch(e => logger.error('Transactions Model Sync Error: ', e));

global.TransactionsModel = Transactions;

module.exports = Transactions;