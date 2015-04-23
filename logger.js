let Logger = {}

Logger.warn = function(){

}

Logger.info = function(){

}

Logger.error = function(){

}

Logger.debug = function(){

}

Logger.log = function(level, input){
	console.log(">< level");
	console.log("instanceof(input)", instanceof(input));
	if (instanceof(input)){

	}
}

/**
 * write to logstream disregarding the log level
 * @return {[type]} [description]
 */
function writeToLogSream(){

}