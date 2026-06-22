function respond(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

exports.ok = (data) => respond(200, { success: true, ...data });
exports.badRequest = (message) => respond(400, { success: false, message });
exports.notFound = (message) => respond(404, { success: false, message });
exports.serverError = (message = "Something went wrong") =>
  respond(500, { success: false, message });
