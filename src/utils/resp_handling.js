/**
 *
 * @param {Number} status
 * @param {String} error_message
 * @returns Object
 */
const error_response_json = function (
  status = 500,
  error_message = "Internal Server Error"
) {
  return { status: status, error: error_message };
};


const response_json = function (
  status = 200,
  message = "",
  data = {}
) {
  return { status, message, data };
};


module.exports = {error_response_json, response_json}
