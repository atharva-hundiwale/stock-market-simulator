async function getStock() {
    let input = document.getElementById("symbolInput").value.trim();
    const card = document.getElementById("stockCard");

    if (!input) {
        alert("Please enter a company name");
        return;
    }

    try {
        const res = await fetch(`http://127.0.0.1:5000/search/${input}`);
        const data = await res.json();

        const meta = data.chart.result[0].meta;

        document.getElementById("stockName").innerText = `${meta.longName} (${meta.symbol})`;
        document.getElementById("price").innerText = meta.regularMarketPrice;
        document.getElementById("high").innerText = meta.regularMarketDayHigh;
        document.getElementById("low").innerText = meta.regularMarketDayLow;
        document.getElementById("prevClose").innerText = meta.previousClose;
        document.getElementById("volume").innerText = meta.regularMarketVolume.toLocaleString();

        const suggestion = document.getElementById("suggestion");
        if (meta.regularMarketPrice > meta.previousClose) {
            suggestion.innerText = "BUY (Uptrend)";
            suggestion.className = "buy";
        } else {
            suggestion.innerText = "SELL (Downtrend)";
            suggestion.className = "sell";
        }

        card.style.display = "block";

    } catch (err) {
        alert("Company not found or server error");
        console.error(err);
    }
}


