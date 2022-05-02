var appRoot = require("app-root-path")  //wo sollen log dateien hingeschrieben werden?=
var winston = require("winston")
var path = require("path")  //auch wichtig für Ort der log-dateien
var PROJECT_ROOT = path.join(__dirname, "..")


var options = {
  file: {
    level: "info",
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880,  //5MB
    maxFiles: 100,
    colorize: false,
  },
  console: {
    level: "error",  //Optionen: "debug", "error"
    handleExceptions: true,
    json: false,
    colorize: true,
  },
}

var logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false,  //do not exit on handled exceptions
})

logger.stream = {
  write: function (message, encoding) {
    logger.info(message)
  },
}

function formatLogArguments(args) {
  args = Array.prototype.slice.call(args)

  var stackInfo = getStackInfo(1)

  if (stackInfo) {
    /* get file path relative to project root */
    var calleeStr = "(" + stackInfo.relativePath + ":" + stackInfo.line + ")"

    if (typeof (args[0] === "string")) {
      args[0] = calleeStr + " " + args[0]
    } else {
      args.unshift(calleeStr)
    }
  }
  return args
}


/* Parses and returns info about the call stack at the given index. */

function getStackInfo(stackIndex) {
  /** get call stack, and analyze it
   * get all files, methods and line numbers */
  var stacklist = new Error().stack.split("\n").slice(3)

  /** stack trace format:
   * http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
   *  do not remove the regex expresses to outside of this method (due to a BUG in node.js) */
  var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\*d)\)/gi
  var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi

  var s = stacklist[stackIndex] || stacklist[0]
  var sp = stackReg.exec(s) || stackReg2.exec(s)

  if (sp && sp.length === 5) {
    return {
      method: sp[1],
      relativePath: path.relative(PROJECT_ROOT, sp[2]),
      line: sp[3],
      pos: sp[4],
      file: path.basename(sp[2]),
      stack: stacklist.join("\n"),
    }
  }
}

module.exports.debug = module.exports.log = function () {
  logger.debug.apply(logger, formatLogArguments(arguments))
}

module.exports.info = function () {
  logger.info.apply(logger, formatLogArguments(arguments))
}

module.exports.warn = function () {
  logger.warn.apply(logger, formatLogArguments(arguments))
}

module.exports.error = function () {
  logger.error.apply(logger, formatLogArguments(arguments))
}

module.exports.stream = logger.stream
