const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const client = new SESClient({});

exports.sendPriceEmail = async ({ email, crypto, price, currency, change24h }) => {
  const changeText =
    change24h != null ? `${change24h >= 0 ? "+" : ""}${change24h.toFixed(2)}%` : "N/A";

  await client.send(
    new SendEmailCommand({
      Source: process.env.SENDER_EMAIL,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: {
          Data: `${crypto} price: ${price} ${currency.toUpperCase()}`,
        },
        Body: {
          Text: {
            Data: [
              "Cryptocurrency Price Update",
              "",
              `Cryptocurrency: ${crypto}`,
              `Price: ${price} ${currency.toUpperCase()}`,
              `24h change: ${changeText}`,
              `Checked at: ${new Date().toISOString()}`,
            ].join("\n"),
          },
        },
      },
    })
  );
};
