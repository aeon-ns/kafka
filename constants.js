
global.TOPIC_NAME           = "payments-topic-3";
global.PROCESS_EXIT_SIGNALS = [
    'exit',
    'SIGINT',
    // 'SIGTERM', 
    // 'SIGQUIT',
    // 'SIGHUP',
    // 'SIGILL',
    // 'SIGABRT',
    // 'SIGFPE',
    // 'SIGSEGV',
    // 'SIGPIPE',
    // 'SIGALRM',
    'SIGUSR1',
    'SIGUSR2',
    // 'SIGCHLD',
    // 'SIGCONT',
    // 'SIGTSTP',
    // 'SIGTTIN',
    // 'SIGTTOU'
    // Cannot listen to these:
    // 'SIGKILL', 
    // 'SIGSTOP',
];


/**
 * @typedef {object} KafkaMessage
 * @property offset  {string|number}
 * @property headers {string}
 * @property value   {string}
 */

/**
 * @typedef {object} Transaction
 * @property id        {string|number}
 * @property amount    {number}
 * @property bank_name {'HDFC'|'YES'|'ICICI'|'KOTAK'}
 */