const { ScanCommand } = require("@aws-sdk/lib-dynamodb");
const db = require("../common/dynamoClient");
const response = require("../common/response");

exports.handler = async () => {
  try {
    const result = await db.send(
      new ScanCommand({ TableName: process.env.TABLE_NAME })
    );

    const history = (result.Items || []).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    return response.ok({ count: history.length, history });
  } catch (err) {
    console.error(err);
    return response.serverError();
  }
};
