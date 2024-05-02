import puppeteer from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs";
import Tesseract from "tesseract.js";
import sharp from "sharp";

// puppeteer.use(StealthPlugin());

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

  // //   const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));

  // // // Set cookies for the page
  // // await page.setCookie(...cookies);

  const navigationTimeout = 600000;
  page.setDefaultNavigationTimeout(navigationTimeout);
  await page.goto("https://www.habitaclia.com/alquiler-en-barcelones.htm");
  // await page.waitForNavigation()
  await page.waitForSelector(".gtmproductclick");

  const linksDone = [];
  // for (var i = 0; i<productLinks.length; i++) {
  //   const links = await page.$$(".gtmproductclick");
  //   page.waitForNavigation()
  //   await links[i].click();
  //   await page.waitForSelector("#js-feature-container");
  //   const redirectedText = await page.evaluate(() => {
  //     const summery = document.querySelector(".summary-left");
  //     const title = summery.querySelector("h1").textContent.trim();
  //     const price = summery
  //       .querySelector('.price span[itemprop="price"]')
  //       .textContent.trim();
  //     const street = summery
  //       .querySelector(".location h4")
  //       .textContent.trim()
  //       .replace(/\s+/g, " ");
  //     const meters = summery
  //       .querySelector(".feature-container li:nth-child(1)")
  //       .textContent.trim();
  //     const rooms = summery
  //       .querySelector(".feature-container li:nth-child(2)")
  //       .textContent.trim();
  //     const toilets = summery
  //       .querySelector(".feature-container li:nth-child(3)")
  //       .textContent.trim();
  //     return { title, price, street, meters, rooms, toilets };
  //   });

    const response = await page.evaluate(async () => {
      // This code runs inside the browser context
      const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
      function extractNumberFromURL(url) {
        const match = url.match(/-i(\d+)\.htm/);
        if (match && match[1]) {
          return match[1];
        } else {
          return null; // Return null if the pattern is not found
        }
      }
      const id = extractNumberFromURL(window.location.href);
      // Concatenate the country code and the random number
      const phoneNumber = `880${randomNumber}`;
      return fetch(
        `https://www.habitaclia.com/hab_inmuebles/solicitud.asp?p=E-X-X-X-X-X-X-X-X-X-${id}&amp;motivo=solicitar&amp;multimarca=movile&amp;op=enviar&amp;espromo=false&amp;lo=&amp;le=`,
        {
          headers: {
            accept: "text/plain, */*; q=0.01",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,bn;q=0.7",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
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
          return telefonoElement ? telefonoElement.textContent.trim() : null;
        });
    });
  //   redirectedText.phone = response;
  //   // console.log(response);
  //   console.log(redirectedText);
  //   await page.goBack()
  // }
  // await page.waitForSelector("#js-contact");
  // await page.evaluate(() => {
  //   window.location.href = "#js-contact";
  // });
  // const elementHandle = await page.$("#CaptchaImage");
  // // Capture the screenshot of the element using the bounding box
  // const screenshot = await page.screenshot({
  //   path: "./elementScreenshot.png",
  // });
  // const croppedImageBuffer = await sharp(screenshot)
  //   .extract({ left: 1090, top: 410, width: 110, height: 40 })
  //   .toBuffer();
  // await sharp(croppedImageBuffer).toFile("cropped_image.png");
  // Tesseract.recognize(croppedImageBuffer, "eng", {
  //   logger: (m) => console.log(m),
  // }).then(({ data: { text } }) => {
  //   console.log(text);
  // });
  // await page.evaluate(() => {
  //   fetch(
  //     "https://www.habitaclia.com/hab_inmuebles/solicitud.asp?p=E-X-X-X-X-X-X-X-X-X-2579003790861&amp;motivo=solicitar&amp;multimarca=movile&amp;op=enviar&amp;espromo=false&amp;lo=&amp;le=",
  //     {
  //       headers: {
  //         accept: "text/plain, */*; q=0.01",
  //         "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,bn;q=0.7",
  //         "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  //         priority: "u=1, i",
  //         "sec-ch-ua":
  //           '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  //         "sec-ch-ua-mobile": "?0",
  //         "sec-ch-ua-platform": '"Windows"',
  //         "sec-fetch-dest": "empty",
  //         "sec-fetch-mode": "cors",
  //         "sec-fetch-site": "same-origin",
  //         "x-requested-with": "XMLHttpRequest",
  //         cookie:
  //           "__utmz=22935970.1713940602.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __gsas=ID=eb6d925da8602066:T=1713940609:RT=1713940609:S=ALNI_MbNWeBOaBNWXKhfA4P-Xyx-LdOtJw; _ga=GA1.2.2007742370.1713940602; _gid=GA1.2.1956491387.1713940614; _gcl_au=1.1.48454345.1713940614; _fbp=fb.1.1713940616604.364502518; info-alerta=closed; ad_tamanofotos=n; G_ENABLED_IDPS=google; __utma=22935970.2007742370.1713940602.1713958461.1713974227.4; __gads=ID=12c88b0eb3abb52b:T=1713944903:RT=1713974253:S=ALNI_MZOvjIJxAg8r6Aa0BMw9E4KZpZGQQ; __gpi=UID=00000df88daceb45:T=1713944903:RT=1713974253:S=ALNI_MaRDBEPVowaC3k1MfggG50iP70J2g; __eoi=ID=85436f32f87d70bc:T=1713944903:RT=1713974253:S=AA-AfjbWbpYUQI1uIelyf7gQNpeA; ASP.NET_SessionId=21b4nx1r4tempvlvtxw3wdgl; __utmc=22935970; reese84=3:Kj2cFqqbHqTDO+9L3brrww==:rr1UVrHmbvTy9jrzi90FbyhZJaMGK29IH/Z+ZJRRDyPeyH9C8DvTxs8rAkEoum9FtzxS3PZ42muwJ3y0xk6FPZdacMiYEAbf6Y40Gz6Sij3imE1uBt6I2WiEhyL4VE9dwrhuoul34+4K/ILiNJzhwaONofP1WOacWAIf0kVkjZ+KwqOzt1SNtXUiVzBcjFg7Onfl/ukk1OFi6QlZ0Z2I8TzCogciUFCafXoHiktRiJ/857sqgLeCx5JJe1EMuXL8CZVJrzUyyhX1CRJJcymhHoWLvGS3Fwq8HDv1xzCLI8YBKYgVUTYdecALOY14RL8E/C//PCZX05eupq4nVcN/bxED4QDBkAfDPmSx4GfmpK9V2DmJK5wsK0zSy9P8A5xAk+hegI8XaeoBxmn2vlgjWH0XWQ9aQK8qxE9c81baUhLibXleFC31i6a63PWk+MZQvVa4qutu34YpB3vwEs044YAatdBC20n2kFRDi/afBlROHl5V1QBaDqwrhIru9kpoRXKNai3nohzVYQb3tPADiQ==:v4wM/1PktS+BNwcide+Suu8vX7Ly8uE/MKfpEI16Njc=; __utmt=1; AMP_TOKEN=%24NOT_FOUND; ASPSESSIONIDSCSQBRDA=IMHMADEAMFBHKFDOJOMDCMMK; cto_bundle=Lo8LYV9udnpjN3VXckY0QyUyQmR6SmR0OXkxSlBaUWNiZGdSNnVzMzAzSWF6dEZNSVV0QlQwREltR21XTVpXS25wdzlXYm9OYTZ4WVlUZ01EQWFZODN6VUxyJTJCSlRjWGFxYSUyRjdNWk41WE9ZYklwUk1pY1hUT2hweE85dTJWMWN6WnJrZk9tbiUyQndpb09xMGdiRVBHV0x4UzZKYkhYZ0ElMkJRTXklMkIwbVNseGJSZTloVG9QVWMlM0Q; _uetsid=5088e550021711ef9bcc8920b21af4a1; _uetvid=50899c20021711efa303eb112a90fa51; habitacliaUtmz=utmcsr=direct|utmcmd=none|utmccn=direct; supportsFlash=false; AWSALB=tg1xryDM3DjDXR6lGFHlGkPqp6A278xFbkn83hoteTqhHxRlojluUXhfQL57HIblCbQyqtXSVdUjNsYDUzH9idktxD9BKVa990I4a8C9sokE9wz7OU1BkI2T6ogW; AWSALBCORS=tg1xryDM3DjDXR6lGFHlGkPqp6A278xFbkn83hoteTqhHxRlojluUXhfQL57HIblCbQyqtXSVdUjNsYDUzH9idktxD9BKVa990I4a8C9sokE9wz7OU1BkI2T6ogW; __utmb=22935970.73.9.1713982441186",
  //         Referer:
  //           "https://www.habitaclia.com/alquiler-piso-dreta_de_l_eixample-barcelona-i2579003790861.htm?f=&geo=c&from=list&lo=55",
  //         "Referrer-Policy": "strict-origin-when-cross-origin",
  //       },
  //       body: "nombre_net=Any%2520Name&telefono_usuario=%2B8801827556283&email=nafizali153%40gmail.com&descripcion_net=Deseo%2520m%25E1s%2520informaci%25F3n%2520del%2520inmueble%2520con%2520referencia%253A%2520habitaclia%2F003.11430&alertaSolicitud=0&alertaOrigen=1&starskyyhash=21288a755dd20245a14ae3a9cf816afd&gtmcoupon=",
  //       method: "POST",
  //     }
  //   ).then(response => {
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     // Check the content type of the response
  //     const contentType = response.headers.get('content-type');
  //     if (contentType.includes('application/json')) {
  //       // If JSON, parse the response as JSON
  //       return response.json();
  //     } else {
  //       // If not JSON, read the response as text
  //       return response.text();
  //     }
  //   })
  //   .then(data => {
  //     console.log(data); // Output the response body
  //   })
  //   .catch(error => {
  //     console.error('There was a problem with your fetch operation:', error);
  //   });;
  // });
  // for (const link of productLinks) {
  //   // // Click on each product link
  //   await page.waitForNavigation()
  //   await link.click();
  //   // // Get some text from the redirected page
  //   // await page.waitForSelector(".js-feature-container")
  //   // const redirectedText = await page.evaluate(() => {
  //   //   return document.querySelector('.js-feature-container').textContent;
  //   // });
  //   // console.log(redirectedText);

  //   // Go back to the previous page
  //   await page.goBack();
  //   // Wait for navigation to complete
  //   await page.waitForNavigation();
  // } 933017777
})();
