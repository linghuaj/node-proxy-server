/**
 * Node Proxy Server
 * @since April, 2015
 * @author Linghua
 */

let http = require('http');
let fs = require('fs');
let request = require('request');
// let through = require('through');
let yargs = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .help('h')
    .alias('m', 'mylog')
    .describe('m', 'specify logfile, otherwise use process stdout')
    .alias('l', 'loglevel')
    .default('l', 'debug')
    .alias('u', 'url')
    .default('u', 'http://localhost:8000')
    .describe('u', 'url that you want to forward request to')
    .example('babel-node index --mylog=/tmp/cat.log', 'start the server and dump logs to specified file')
    .example('babel-node index --loglevel=alert', 'set the log level to alret');


let argv = yargs.argv; //if there is not host pass from cli, use localhost as default value
let port = argv.port || 80;
//bode index --host www.google.com --port 80
let destUrl = argv.url || (argv.host === "localhost" ? "http://localhost:8000" : "http://" + argv.host + ":" + port);

//logger
let logstream = argv.mylog ? fs.createWriteStream(argv.mylog) : process.stdout;
let logLevelSetting = argv.loglevel || 'debug';
let Logger = require('./lib/logger');
let myLog = new Logger(logLevelSetting, logstream);
//child process
let ChildProcess = require('./lib/childProcess');


if (argv.exec) {
    ChildProcess.spawn(argv);
}

//set up the origin server
http.createServer((req, res) => {
    for (let header in req.headers) {
        res.setHeader(header, req.headers[header]);
    }
    req.pipe(res);

}).listen(8000);

myLog.alert("listen to localhost:8000 \n");

//set up the proxy server
//curl -v http://127.0.0.1:8001 -d "niuniu" -H "x-asdf: foo"
http.createServer((req, res) => {
    let options = {
            headers: req.headers, //forward the header to dest server
            url: req.headers['x-destination-url'] || destUrl
        }
        //make sure path and query param are forwarded.
    options.url += req.url;
    //request(options) is a readable and writeable stream
    //then pipe the stream to response 
    var downStream = req.pipe(request(options));
    myLog.debug("><request111");
    myLog.info(req);
    //replaced with logger
    // through(downStream, logstream, {
    //        autoDestroy: false
    // });
    downStream.pipe(res);

    myLog.debug("><downstream111");
    myLog.info(downStream);

}).listen(8001);

myLog.alert("listen to localhost:8001 \n");