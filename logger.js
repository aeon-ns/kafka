const chalk   = require('chalk');
const winston = require('winston');

const logger = (prefix = '#_#', color = 'white') => winston.createLogger({
    format: winston.format.combine(
        winston.format.colorize({ all: false }),
        // winston.format.json(),
        winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
        winston.format.printf(info => `${chalk[color](`[${prefix}]`)}${chalk.dim('[')}${info.level}${chalk.dim(']::')} ${info.message}\t${chalk.dim(`[${info.timestamp}]`)}`)
    ),
    transports: [
        new winston.transports.Console()
    ]
});

module.exports = logger;