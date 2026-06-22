const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const client = new SESClient({});

function toSesError(err) {
  const message = err.message || "";

  if (err.name === "MessageRejected" && /not verified/i.test(message)) {
    const email = message.split(": ").pop();
    const error = new Error(
      email && email.includes("@")
        ? `Email address ${email} is not verified in SES`
        : "Recipient email is not verified in SES"
    );
    error.code = "SES_EMAIL_NOT_VERIFIED";
    return error;
  }

  if (err.name === "MessageRejected") {
    const error = new Error(message || "Email could not be sent via SES");
    error.code = "SES_MESSAGE_REJECTED";
    return error;
  }

  return err;
}

exports.sendPriceEmail = async ({ email, crypto, price, currency, change24h }) => {
  const changeText =
    change24h != null ? `${change24h >= 0 ? "+" : ""}${change24h.toFixed(2)}%` : "N/A";

  try {
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
  } catch (err) {
    throw toSesError(err);
  }
};
