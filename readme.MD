# Proxy Server

This is a Proxy Server for Node.js submitted as the [pre-work](http://courses.codepath.com/snippets/intro_to_nodejs/prework) requirement for CodePath.

Time spent: [1hr]

##Completed:

* [done] Required: Requests to port `8000` are echoed back with the same HTTP headers and body
* [done] Required: Requests/reponses are proxied to/from the destination server
* [done] Required: The destination server is configurable via the `--host`, `--port`  or `--url` arguments
* [done] Required: The destination server is configurable via the `x-destination-url` header
* [done] Required: Client requests and respones are printed to stdout
* [done] Required: The `--logfile` argument outputs all logs to the file specified instead of stdout
* [done] Optional: The `--exec` argument proxies stdin/stdout to/from the destination program
* [done] Optional: The `--loglevel` argument sets the logging chattiness
* [todo] Optional: Supports HTTPS
* [todo] Optional: `-h` argument prints CLI API


For help. run
```javascript
babel-node index.js  -h
```

##Recording of achievements as gif:

[![solarized dualmode](https://github.com/vanessachem/codpath-proxy-server/blob/master/assets/record.gif)](#features)

##to reproduce the gif, plz try any of the following: 

```javascript
//do a npm install first

npm start
curl -v http://127.0.0.1:8001 -H 'x-cat:niuniu'


nodemon -x babel-node index --url http://google.com
curl -v http://127.0.0.1:8001 -H 'x-cat:niuniu'


nodemon -x babel-node index --host google.com --port 80
curl -v http://127.0.0.1:8001 -H 'x-cat:niuniu'


babel-node index
curl -v http://127.0.0.1:8001 -H 'x-cat:niuniu'
curl -v http://127.0.0.1:8001 -H 'x-destination-url:http://google.com'


babel-node index --mylog=/tmp/codepath-proxy.log

curl -v http://127.0.0.1:8001 -H 'x-destination-url:http://google.com'
```

##child process:

[![solarized dualmode](https://github.com/vanessachem/codpath-proxy-server/blob/master/assets/childProcess.gif)](#features)

##log level:
[![solarized dualmode](https://github.com/vanessachem/codpath-proxy-server/blob/master/assets/loglevel.gif)](#features)

