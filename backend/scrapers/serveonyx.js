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
    console.log('Navigating to Serveonyx...');
    await page.goto('https://serveonyx.com/login', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Fill in login credentials
    console.log('Logging in...');
    await page.type('input[type="email"]', email, { delay: 50 });
    await page.type('input[type="password"]', password, { delay: 50 });
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });

    // Navigate to products/shop page
    console.log('Fetching products...');
    await page.goto('https://serveonyx.com/shop', {
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
