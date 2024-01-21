import chalk from 'chalk';

export default class Logger {
    constructor(config) {
        this.verbose = config.verbose;
    }

    debug(...args) {
        if (this.verbose) {
            console.log(chalk.green('[DEBUG]'), ...args);
        }
    }

    log(...args) {
        console.log(chalk.blue('[INFO]'), ...args);
    }

    error(...args) {
        console.error(chalk.red('[ERROR]'), ...args);
    }

    warn(...args) {
        console.warn(chalk.yellow('[WARN]'), ...args);
    }
}