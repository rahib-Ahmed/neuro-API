const logger = require("./logger");

/**
 * logs the information of the responses, error and bugs in a log file
 * @param {String} type "INFO,DEBUG,ERROR"
 * @param {*} userReq "Request of the call made by user"
 * @param {*} resp "Response sent to the call"
 * @param {*} lineNumber "Line number using the line number function"
 */
module.exports = function (type, userReq, resp, lineNumber) {
  try {
    let message = "";

    if (userReq.originalUrl)
      message += message
        ? ","
        : "" + " URL: " + JSON.stringify(userReq.originalUrl);
    if (userReq.method)
      message +=
        (message ? "," : "") + " Method: " + JSON.stringify(userReq.method);
    if (userReq.body && JSON.stringify(userReq.body) !== "{}")
      message +=
        (message ? "," : "") +
        " Body Parameter: " +
        JSON.stringify(userReq.body);
    if (userReq.query && JSON.stringify(userReq.query) !== "{}")
      message +=
        (message ? "," : "") +
        " Query Parameter: " +
        JSON.stringify(userReq.query);
    if (resp)
      message +=
        (message ? "," : "") +
        " Response: " +
        (resp instanceof TypeError ? resp : JSON.stringify(resp));
    if (lineNumber)
      message += (message ? "," : "") + ` LineNumber:${lineNumber}`;
    logger[type.toLowerCase()](message);
  } catch (ex) {
    console.log("error in logging Function", ex);
  }
};
