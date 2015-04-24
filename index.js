//nodemon -x babel-node -- index

let http = require('http');
let fs = require('fs');
let request = require('request');
let yargs = require('yargs'); //allow pass args from commandline
let through = require('through');

let argv = yargs.default('host', 'localhost').argv; //if there is not host pass from cli, use localhost as default value
let port = argv.port || 80;
//bode index --host www.google.com --port 80
let destUrl = argv.url || (argv.host === "localhost" ? "http://localhost:8000" : "http://" + argv.host + ":" + port);

//logger
let logstream = argv.mylog ? fs.createWriteStream(argv.mylog) : process.stdout;
let logLevelSetting = argv.loglevel || 'debug';
let Logger = require('./logger');
let myLog = new Logger(logLevelSetting, logstream);

//child process
let ChildProcess = require('./childProcess');


if (argv.exec){
   ChildProcess.spawn(argv);
}


//set up the origin server
http.createServer((req, res) => {
    for (let header in req.headers) {
        res.setHeader(header, req.headers[header]);
    }
    through(req, logstream, {
        autoDestroy: false
    });
    req.pipe(res);

}).listen(8000);

logstream.write("listen to localhost:8000 \n");

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
    // through(downStream, logstream, {
    //        autoDestroy: false
    // });

    downStream.pipe(res);
    
    myLog.debug("><downstream111");
    myLog.info(downStream);


}).listen(8001);

logstream.write("listen to localhost:8001 \n");