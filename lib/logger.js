let logLevelLookup = {
    'alert': 0,
    'error': 1,
    'warn': 2,
    'info': 3,
    'debug': 4
}

class Logger {
    /**
     * class logger
     * log input into logstream based on global log level.
     *
     * @param  {[type]} loglevel  [description]
     * @param  {[type]} logstream [description]
     * @return {[type]}           [description]
     */
    constructor(loglevel, logstream) {
        this.logLevel = loglevel || 'debug';
        this.logstream = logstream || process.stdout;
    }

    logMsg(level, input) {
        if (logLevelLookup[level] > logLevelLookup[this.logLevel]) {
            return;
        }
        var logStr = "Logger[" + level + "]: ";

        if (typeof(input) === 'string') {
            this.logstream.write(logStr + '[string] ' + input + '\n');
            return
        }
        console.log("><inputreadable", input.readable);//if input is a readale stream;
        //todo what is the best way for stream;
        if (typeof(input) === 'object' && input.hasOwnProperty('readable')) {
            this.logstream.write(logStr + '[stream]: ' + '\n');
            // do not end the file after one response end. 
            // end:false is needed for writing to a file
            // if use console.log it is not needed
            input.pipe(this.logstream,{end: false});
            return;
        }

        return this.logstream.write(logStr + '[object] ' + JSON.stringify(input));

    }

    alert(input) {
        return this.logMsg('alert', input);
    }

    error(input) {
        return this.logMsg('error', input);
    }

    warn(input) {
        return this.logMsg('warn', input);
    }

    info(input) {
        return this.logMsg('info', input);
    }

    debug(input) {
        return this.logMsg('debug', input);
    }
}

module.exports = Logger;