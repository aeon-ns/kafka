const chalk     = require('chalk');
const winston   = require('winston');
const { LEVEL, SPLAT } = require('triple-beam');

const logger = (prefix = '#_#', color = 'white') => winston.createLogger({
    format: winston.format.combine(
        winston.format.colorize({ all: false }),
        winston.format.json(),
        // winston.format.align(),
        winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
        winston.format.printf(info => {
            // console.log(info);
            return [
                `${chalk.italic(chalk[color](`[${prefix}]`))}${chalk.dim('[')}${info.level.replace(info[LEVEL], info[LEVEL].toUpperCase())}${chalk.dim(']:')}`,
                info[LEVEL] === 'info' ? info.message : info[LEVEL] === 'error' ? chalk.redBright(info.stack || info.message) : chalk.yellow(info.message), 
                chalk.dim(info[SPLAT] && info[SPLAT].map(x => typeof x === 'object' ? JSON.stringify(x) : x).join(' ') || ''),
                `\n${chalk.italic(chalk.blackBright(`[${info.timestamp}]`))}\n`,
            ].join(' ')
        })
    ),
    transports: [
        new winston.transports.Console()
    ],
    handleExceptions: true
});

module.exports = logger;