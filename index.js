const express = require("express");
const app = express();
const puppeteer = require("puppeteer");
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);

async function weather_data() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--incognito", "--no-sandbox", "--single-process", "--no-zygote"],
  });
  const page = await browser.newPage();

  await page.goto("https://www.google.com/search?q=tempo+rio+de+janeiro+graus+celsius");

  const weather = await page.evaluate(() => {
    return {
      tempoAtual: document.getElementById("wob_tm").innerText,
      chanceChuva: document.getElementById("wob_pp").innerText,
      umidade: document.getElementById("wob_hm").innerText,
      vento: document.getElementById("wob_ws").innerText,
    };
  });

  await browser.close();
  return weather;
}

app.get("/", (req, res, next) => {
  weather_data().then((data) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.json({ data: data });
    next();
  });
});

app.listen(process.env.PORT || 3000);
