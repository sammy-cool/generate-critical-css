const puppeteer = require('puppeteer');

async function generateCriticalCSS(url, viewportWidth, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the viewport size
  await page.setViewport({
    width: viewportWidth,
    height: 800, // Adjust the height as needed
  });

  // Navigate to the URL
  await page.goto(url, { waitUntil: 'networkidle0' });

  // Generate critical CSS
  const criticalCSS = await page.evaluate(() => {
    const styleTags = document.querySelectorAll('style,link[rel="stylesheet"]');
    let criticalStyles = '';

    styleTags.forEach((tag) => {
      if (tag.getAttribute('data-critical')) {
        criticalStyles += tag.innerHTML;
      }
    });

    return criticalStyles;
  });

  // Save the critical CSS to a file
  const fs = require('fs');
  fs.writeFileSync(outputPath, criticalCSS);

  await browser.close();
}

// Usage example
const url = process.env.INPUT_URL; // Replace with your target URL
const viewportWidth = 1200; // Set the viewport width
const outputPath = 'critical.css'; // Output file path

generateCriticalCSS(url, viewportWidth, outputPath)
  .then(() => {
    console.log(`Critical CSS generated and saved to ${outputPath}`);
  })
  .catch((error) => {
    console.error('Error generating critical CSS:', error);
  });
