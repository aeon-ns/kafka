const moment = require("moment");
const { DataTypes } = require("sequelize");

if (!global.Sql) {
    throw "Sequelize connection must be initiated before importing this file."
}

const Transactions = Sql.define('transactions', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    amount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
    },
    bank_name: {
        type: DataTypes.ENUM('HDFC', 'KOTAK', 'YES', 'ICICI'),
        defaultValue: null,
    },
    status: {
        type: DataTypes.ENUM('pending', 'inprogress', 'success', 'failed'),
        defaultValue: 'pending',
    }
}, {
    freezeTableName : true
});

Transactions.sync({ force: false })
    .then(() => console.log('[SQL] Transactions Model Synced'))
    .catch(e => console.error('[SQL] Transactions Model Sync Error: ', e));

global.TransactionsModel = Transactions;

module.exports = Transactions;