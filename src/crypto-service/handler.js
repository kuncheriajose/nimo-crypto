const { getPrice } = require("./coingeckoService");
const { saveHistory } = require("./historyService");
const { sendPriceEmail } = require("./emailService");
const response = require("../common/response");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { crypto, email, currency = "usd" } = body;

    if (!crypto || !email) {
      return response.badRequest("crypto and email are required");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return response.badRequest("email must be a valid email address");
    }

    const { crypto: coin, price, currency: curr, change24h } = await getPrice(
      crypto,
      currency
    );

    const record = await saveHistory({
      crypto: coin,
      price,
      currency: curr,
      email,
    });

    await sendPriceEmail({
      email,
      crypto: coin,
      price,
      currency: curr,
      change24h,
    });

    return response.ok({ price, crypto: coin, currency: curr, timestamp: record.timestamp });
  } catch (err) {
    if (err.code === "NOT_FOUND") {
      return response.notFound(err.message);
    }
    console.error(err);
    return response.serverError();
  }
};
