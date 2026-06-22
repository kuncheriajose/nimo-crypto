const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("node:crypto");
const db = require("../common/dynamoClient");

exports.saveHistory = async ({ crypto, price, currency, email }) => {
  const item = {
    id: randomUUID(),
    crypto,
    price,
    currency,
    email,
    timestamp: new Date().toISOString(),
  };

  await db.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: item,
    })
  );

  return item;
};
