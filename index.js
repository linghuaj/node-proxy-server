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
let logstream = argv.mylog ? fs.createWriteStream(argv.mylog) : process.stdout;
let processInput =  process.stdin.read();

let ChildProcess = require('./childProcess');
let loggerLevelSetting = argv.loglevel || 'debug';
if (argv.exec){
   ChildProcess.spawn(argv);
}
//TODO: log level
// console.log("><loglevel", argv.loglevel);

var Logger = {};
Logger.log = function(){

};


Logger.logMsg = function(level, input){
    // console.log(">< level", level);
    // console.log("><input", input);
    // console.log(">< inputinstance", typeof(input));
    // console.log("input", input);
    var logStr = "Logger[" + level + "]: ";

    if (typeof(input) === 'string'){

        console.log("\n >< is a string \n");
       return logstream.write(logStr + '[string] ' +input);
    }
    //todo what is the best way for stream;
    if (typeof(input) === 'object' && input.hasOwnProperty('readable')){
       console.log("\n>< is a stream;\n")
       logstream.write(logStr + '[stream]: ');
       input.pipe(logstream);
       // req.pipe(logstream); if we use pipe, logstream will end when the res is end. using through will keep the file from ending. 
       // through(input, logstream, {
       //     autoDestroy: false
       // });

       return;

    }

    return logstream.write(logStr + '[object] ' + JSON.stringify(input));

}


//set up the origin server
http.createServer((req, res) => {
    // Logger.logMsg("info" + JSON.stringify(req));
    for (let header in req.headers) {
        res.setHeader(header, req.headers[header]);
    }
    // req.pipe(logstream);
    through(req, logstream, {
        autoDestroy: false
    });
    req.pipe(res);

}).listen(8000);

logstream.write("listen to localhost:8000 \n");

//set up the proxy server
//curl -v http://127.0.0.1:8001 -d "niuniu" -H "x-asdf: foo"
http.createServer((req, res) => {
    // Logger.logMsg("info", "localhost:8001");
    // Logger.logMsg("info", JSON.stringify(req));
    // logstream.write(, req);
    let options = {
            headers: req.headers, //forward the header to dest server
            url: req.headers['x-destination-url'] || destUrl
        }
        //make sure path and query param are forwarded.
    options.url += req.url;
    //request(options) is a readable and writeable stream
    //then pipe the stream to response 
    var downStream = req.pipe(request(options));
    // req.pipe(logstream);
    Logger.logMsg("info", "request111");
    Logger.logMsg("info", req);
    downStream.pipe(res);
    Logger.logMsg("info", "downstream111");
    Logger.logMsg("info", downStream);

    // downStream.pipe(logstream);


    // Logger.logMsg("info", "\n new request headers: \n" + JSON.stringify(req.headers));

}).listen(8001);

logstream.write("listen to localhost:8001 \n");