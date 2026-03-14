const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static("public"));

const PORT = 5000;

// Test route
app.get("/", (req, res) => {
    res.send("Server is running");
});

// 🌍 Search ANY company worldwide and return stock data
app.get("/search/:company", async (req, res) => {
    const company = req.params.company;

    try {
        // 1️⃣ Search company name globally
        const searchRes = await axios.get(
            `https://query1.finance.yahoo.com/v1/finance/search?q=${company}`
        );

        // Find first stock result
        const stock = searchRes.data.quotes.find(q => q.quoteType === "EQUITY");

        if (!stock) {
            return res.status(404).json({ error: "Stock not found" });
        }

        const symbol = stock.symbol;
        console.log("Found symbol:", symbol);

        // 2️⃣ Fetch live stock price data
        const stockRes = await axios.get(
            `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=5m&range=1d`
        );

        res.json(stockRes.data);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to fetch company data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
