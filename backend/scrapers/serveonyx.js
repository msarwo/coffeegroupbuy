const puppeteer = require('puppeteer');

async function scrapeServeonyx(email, password) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 720 });

    // Navigate to login page
    console.log('Navigating to Onyx Coffee Lab...');
    await page.goto('https://onyxcoffeelab.com/account/login', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Try filling in login credentials if the login form exists.
    console.log('Attempting login (if login form present)...');
    try {
      const emailSelectors = ['input[type="email"]', 'input[name="email"]', 'input#email'];
      const passSelectors = ['input[type="password"]', 'input[name="password"]', 'input#password'];
      const submitSelectors = ['button[type="submit"]', 'input[type="submit"]', 'button.login-button', 'button[aria-label="Log in"]'];

      let emailSel = null;
      for (const s of emailSelectors) {
        if (await page.$(s)) { emailSel = s; break; }
      }

      let passSel = null;
      for (const s of passSelectors) {
        if (await page.$(s)) { passSel = s; break; }
      }

      if (emailSel && passSel) {
        await page.type(emailSel, email, { delay: 50 });
        await page.type(passSel, password, { delay: 50 });

        // Try clicking a submit button if present
        let clicked = false;
        for (const s of submitSelectors) {
          const btn = await page.$(s);
          if (btn) {
            try {
              await btn.click();
              clicked = true;
              break;
            } catch (e) {
              // ignore click failure and try next
            }
          }
        }

        if (clicked) {
          await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
        } else {
          console.log('Login form found but no clickable submit button; continuing without explicit click.');
        }
      } else {
        console.log('Login form selectors not found, continuing without login.');
      }
    } catch (err) {
      console.log('Login attempt failed or not required, continuing.');
    }

    // Navigate to products/shop page
    console.log('Fetching products...');
    await page.goto('https://onyxcoffeelab.com/collections/coffee', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for products to load
    await page.waitForSelector('.product', { timeout: 10000 }).catch(() => {
      console.log('Trying alternative selector...');
    });

    // Scrape product data
    const products = await page.evaluate(() => {
      const items = [];
      
      // Try multiple selectors for products
      const productElements = document.querySelectorAll('.product-item, .product-card, [class*="product"]');
      
      productElements.forEach((element) => {
        try {
          const nameEl = element.querySelector('[class*="name"], [class*="title"], h2, h3');
          const priceEl = element.querySelector('[class*="price"], .cost, [data-price]');
          const linkEl = element.querySelector('a');
          const imageEl = element.querySelector('img');

          if (nameEl && priceEl) {
            const name = nameEl.textContent.trim();
            let price = priceEl.textContent.trim();
            
            // Extract numeric price
            price = parseFloat(price.replace(/[^0-9.]/g, ''));
            
            if (!isNaN(price) && price > 0) {
              items.push({
                name,
                price,
                url: linkEl ? linkEl.href : null,
                image: imageEl ? imageEl.src : null
              });
            }
          }
        } catch (e) {
          console.log('Error parsing product:', e);
        }
      });

      return items;
    });

    console.log(`Found ${products.length} products`);

    // Filter out duplicates and invalid entries
    const uniqueProducts = Array.from(
      new Map(products.map(p => [p.name, p])).values()
    ).filter(p => p.price > 0);

    await browser.close();
    return uniqueProducts;

  } catch (error) {
    console.error('Error scraping Serveonyx:', error);
    if (browser) {
      await browser.close();
    }
    throw error;
  }
}

module.exports = { scrapeServeonyx };
