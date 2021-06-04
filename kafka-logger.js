const { logLevel } = require('kafkajs');
const winston = require('winston');
const chalk = require('chalk');

const toWinstonLogLevel = level => {
    switch (level) {
        case logLevel.ERROR:
        case logLevel.NOTHING:
            return 'error'
        case logLevel.WARN:
        default:
            return 'warn'
        case logLevel.INFO:
            return 'info'
        case logLevel.DEBUG:
            return 'debug'
    }
};

const WinstonLogCreator = logLevel => {
    const logger = winston.createLogger({
        level: toWinstonLogLevel(logLevel),
        format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.json(),
            winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
            winston.format.printf(info => `${chalk.grey('[KAFKA]')}${chalk.dim('[')}${info.level}${chalk.dim(']::')} ${info.message}\t${chalk.dim(`[${info.timestamp}]`)}`)
        ),
        transports: [
            new winston.transports.Console()
        ]
    })

    return ({ namespace, level, label, log }) => {
        const { message, ...extra } = log
        logger.log({
            level: toWinstonLogLevel(level),
            message,
            extra,
        })
    }
};

module.exports = WinstonLogCreator;