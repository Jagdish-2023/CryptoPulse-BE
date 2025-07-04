const express = require("express");
const axios = require("axios");
const router = express.Router();

const SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "SOLUSDT",
  "DOGEUSDT",
  "DOTUSDT",
  "AVAXUSDT",
  "LTCUSDT",
];

router.get("/download-prices-report", async (req, res) => {
  try {
    const streamURL = `https://api.binance.com/api/v3/ticker/price`;

    const response = await axios.get(streamURL);
    const prices = response.data.filter((entry) =>
      SYMBOLS.includes(entry.symbol)
    );

    let csv = "Symbol,Price,Date,Time\n";
    const currentDateObj = new Date();
    const date = currentDateObj.toLocaleDateString();
    const time = currentDateObj.toLocaleTimeString();

    prices.forEach((coin) => {
      csv += `${coin.symbol},$${coin.price},${date},${time}\n`;
    });

    res.setHeader(
      "Content-disposition",
      "attachment; filename=crypto_prices_report.csv"
    );
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (err) {
    console.error("Failed to fetch price data:", err);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

router.get("/download-history-report/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    const response = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=24`
    );

    const data = response.data;

    let csv = "Date,Time,Open,High,Low,Close\n";

    data.forEach((item) => {
      const dateObj = new Date(item[0]);
      const date = dateObj.toLocaleDateString();
      const time = dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const open = item[1];
      const high = item[2];
      const low = item[3];
      const close = item[4];

      csv += `${date},${time},$${open},$${high},$${low},$${close}\n`;
    });

    res.setHeader(
      "Content-disposition",
      `attachment; filename=${symbol}_24h_history.csv`
    );
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (err) {
    console.error("Error generating history report:", err);
    res.status(500).json({ error: "Failed to fetch historical data" });
  }
});

module.exports = router;
