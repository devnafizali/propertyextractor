import puppeteer from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs";
import Tesseract from "tesseract.js";
import sharp from "sharp";

(async () => {
  const wsChromeEndpointurl =
    "ws://127.0.0.1:9222/devtools/browser/b1adfd03-4d9e-437e-9391-4902dce33f26";
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
  const myArray = JSON.parse(fs.readFileSync("links.json", "utf8"));
  const properties = [];
  var i = 1;
  for (const link of myArray) {
    if (i > 2439) {
      try {
        const url = link;
        const data = await page.evaluate(async (url) => {
          function extractNumberFromURL(url) {
            const match = url.match(/-i(\d+)\.htm/);
            if (match && match[1]) {
              return match[1];
            } else {
              return null; // Return null if the pattern is not found
            }
          }
          const id = extractNumberFromURL(url);

          const detail = await fetch(url)
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
          const phone = await fetch(
            `https://www.habitaclia.com/hab_inmuebles/solicitud.asp?p=E-X-X-X-X-X-X-X-X-X-${id}&amp;motivo=solicitar&amp;multimarca=movile&amp;op=enviar&amp;espromo=false&amp;lo=&amp;le=`,
            {
              headers: {
                accept: "text/plain, */*; q=0.01",
                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,bn;q=0.7",
                "content-type":
                  "application/x-www-form-urlencoded; charset=UTF-8",
                priority: "u=1, i",
                "sec-ch-ua":
                  '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                cookie:
                  "__utmz=22935970.1713940602.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __gsas=ID=eb6d925da8602066:T=1713940609:RT=1713940609:S=ALNI_MbNWeBOaBNWXKhfA4P-Xyx-LdOtJw; _ga=GA1.2.2007742370.1713940602; _gid=GA1.2.1956491387.1713940614; _gcl_au=1.1.48454345.1713940614; _fbp=fb.1.1713940616604.364502518; info-alerta=closed; ad_tamanofotos=n; G_ENABLED_IDPS=google; __utma=22935970.2007742370.1713940602.1713958461.1713974227.4; __gads=ID=12c88b0eb3abb52b:T=1713944903:RT=1713974253:S=ALNI_MZOvjIJxAg8r6Aa0BMw9E4KZpZGQQ; __gpi=UID=00000df88daceb45:T=1713944903:RT=1713974253:S=ALNI_MaRDBEPVowaC3k1MfggG50iP70J2g; __eoi=ID=85436f32f87d70bc:T=1713944903:RT=1713974253:S=AA-AfjbWbpYUQI1uIelyf7gQNpeA; ASP.NET_SessionId=21b4nx1r4tempvlvtxw3wdgl; __utmc=22935970; reese84=3:Kj2cFqqbHqTDO+9L3brrww==:rr1UVrHmbvTy9jrzi90FbyhZJaMGK29IH/Z+ZJRRDyPeyH9C8DvTxs8rAkEoum9FtzxS3PZ42muwJ3y0xk6FPZdacMiYEAbf6Y40Gz6Sij3imE1uBt6I2WiEhyL4VE9dwrhuoul34+4K/ILiNJzhwaONofP1WOacWAIf0kVkjZ+KwqOzt1SNtXUiVzBcjFg7Onfl/ukk1OFi6QlZ0Z2I8TzCogciUFCafXoHiktRiJ/857sqgLeCx5JJe1EMuXL8CZVJrzUyyhX1CRJJcymhHoWLvGS3Fwq8HDv1xzCLI8YBKYgVUTYdecALOY14RL8E/C//PCZX05eupq4nVcN/bxED4QDBkAfDPmSx4GfmpK9V2DmJK5wsK0zSy9P8A5xAk+hegI8XaeoBxmn2vlgjWH0XWQ9aQK8qxE9c81baUhLibXleFC31i6a63PWk+MZQvVa4qutu34YpB3vwEs044YAatdBC20n2kFRDi/afBlROHl5V1QBaDqwrhIru9kpoRXKNai3nohzVYQb3tPADiQ==:v4wM/1PktS+BNwcide+Suu8vX7Ly8uE/MKfpEI16Njc=; __utmt=1; AMP_TOKEN=%24NOT_FOUND; ASPSESSIONIDSCSQBRDA=IMHMADEAMFBHKFDOJOMDCMMK; cto_bundle=Lo8LYV9udnpjN3VXckY0QyUyQmR6SmR0OXkxSlBaUWNiZGdSNnVzMzAzSWF6dEZNSVV0QlQwREltR21XTVpXS25wdzlXYm9OYTZ4WVlUZ01EQWFZODN6VUxyJTJCSlRjWGFxYSUyRjdNWk41WE9ZYklwUk1pY1hUT2hweE85dTJWMWN6WnJrZk9tbiUyQndpb09xMGdiRVBHV0x4UzZKYkhYZ0ElMkJRTXklMkIwbVNseGJSZTloVG9QVWMlM0Q; _uetsid=5088e550021711ef9bcc8920b21af4a1; _uetvid=50899c20021711efa303eb112a90fa51; habitacliaUtmz=utmcsr=direct|utmcmd=none|utmccn=direct; supportsFlash=false; AWSALB=tg1xryDM3DjDXR6lGFHlGkPqp6A278xFbkn83hoteTqhHxRlojluUXhfQL57HIblCbQyqtXSVdUjNsYDUzH9idktxD9BKVa990I4a8C9sokE9wz7OU1BkI2T6ogW; AWSALBCORS=tg1xryDM3DjDXR6lGFHlGkPqp6A278xFbkn83hoteTqhHxRlojluUXhfQL57HIblCbQyqtXSVdUjNsYDUzH9idktxD9BKVa990I4a8C9sokE9wz7OU1BkI2T6ogW; __utmb=22935970.73.9.1713982441186",
                Referer: `https://www.habitaclia.com/alquiler-piso-dreta_de_l_eixample-barcelona-i${id}.htm?f=&geo=c&from=list&lo=55`,
                "Referrer-Policy": "strict-origin-when-cross-origin",
              },
              body: {},
              method: "POST",
            }
          )
            .then((response) => response.text())
            .then((html) => {
              // Parse the HTML to extract the desired element's text content
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, "text/html");
              const telefonoElement = doc.querySelector("telefono_contacto");
              return telefonoElement
                ? telefonoElement.textContent.trim()
                : null;
            });
          const property = await detail;
          property.phone = await phone;
          return property;
        }, url);

        console.log(data);
        properties.push(data);
        fs.writeFileSync("outputdata.json", JSON.stringify(properties));
        console.log("Property " + i + " => done");
      } catch (error) {
        console.log(error);
      }
    }
    i++;
  }
})();
