let spawn = require('child_process').spawn;
let ChildProcess = {};
/**
 * HTTP proxying is nice, but let's make this a multi-purpose proxy process.
 * Allow a process name to be specified in the --exec argument. 
 * You'll want to use child_process.spawn to pipe stdin/stdout/stderr between the process and the child process.
 *
 * cat index.js | babel-node index.js --exec grep require
 * 
 * @param  {[type]} argv [description]
 * @return {[type]}      [description]
 */
ChildProcess.spawn = function(argv) {
    let action = argv.exec;
    //TODO potention bug
    //https://github.com/vanessachem/codpath-proxy-server/issues/2
    let action_args = argv._;
    // process.stdin.setEncoding('utf8');
    // process.stdin.on('readable', function() {
    //   var chunk = process.stdin.read();
    //   if (chunk !== null) {
    //     logstream.write('data: ' + chunk);
    //   }
    // });

    // process.stdin.on('end', function() {
    //   logstream.write('end');
    // });
    // 
    // 
    // 
    //inherit parent stdin and stdout
    spawn(action, action_args, {
        stdio: 'inherit'
    });
    console.log("Child Process executed: " + action + " " + action_args.join(" "));
}
module.exports = ChildProcess;