const axios = require("axios");

const COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price";

exports.getPrice = async (crypto, currency = "usd") => {
  const coin = crypto.toLowerCase().trim();

  const response = await axios.get(COINGECKO_URL, {
    params: {
      ids: coin,
      vs_currencies: currency,
      include_24hr_change: true,
    },
  });

  if (!response.data[coin]) {
    const err = new Error(`Cryptocurrency '${coin}' not found`);
    err.code = "NOT_FOUND";
    throw err;
  }

  return {
    crypto: coin,
    price: response.data[coin][currency],
    currency,
    change24h: response.data[coin][`${currency}_24h_change`] ?? null,
  };
};
