import puppeteer from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs";
import Tesseract from "tesseract.js";
import sharp from "sharp";

(async () => {
  const saveResponseImage = async (response) => {
    const buffer = await response.buffer();
    fs.writeFileSync("responseImage.png", buffer);
    console.log("Response image saved successfully");
  };
  const wsChromeEndpointurl =
    "ws://127.0.0.1:9222/devtools/browser/7f2d37ba-59b2-43ca-9e9a-b4abdf52a6c5";
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsChromeEndpointurl,
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
  });
  const navigationTimeout = 600000;
  page.setDefaultNavigationTimeout(navigationTimeout);
  await page.goto("https://www.habitaclia.com/alquiler-en-barcelones.htm");
  await page.waitForSelector(".gtmproductclick");

  const propertyLinks = [];
  for (var i = 1; i <= 218; i++) {
    const url = `https://www.habitaclia.com/alquiler-en-barcelones-${i}.htm`;
    const cpageList = await page.evaluate(async (url) => {
      return fetch(url)
        .then((response) => response.text())
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const summery = doc.querySelector(".summary-left");
              const title = summery.querySelector("h1").textContent.trim();
              const price = summery
                .querySelector('.price span[itemprop="price"]')
                .textContent.trim();
              const street = summery
                .querySelector(".location h4")
                .textContent.trim()
                .replace(/\s+/g, " ");
              const meters = summery
                .querySelector(".feature-container li:nth-child(1)")
                .textContent.trim();
              const rooms = summery
                .querySelector(".feature-container li:nth-child(2)")
                .textContent.trim();
              const toilets = summery
                .querySelector(".feature-container li:nth-child(3)")
                .textContent.trim();
              return { title, price, street, meters, rooms, toilets };
        });
    }, url);
    
    propertyLinks.push(...cpageList);
    fs.writeFileSync("outputlinks.json", JSON.stringify(propertyLinks));
    console.log("Page " + i + " => done");
  }
  console.log(propertyLinks);
 
})();
