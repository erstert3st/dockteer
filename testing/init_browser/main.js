const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Website to open - change this URL to your desired website
const TARGET_URL = 'https://coding-freaks.com/';

// Maximum wait time in milliseconds (10 minutes)
const MAX_WAIT_TIME = 10 * 60 * 1000;

// Function to create a screenshots directory if it doesn't exist
function ensureScreenshotsDir() {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
    console.log(`Created screenshots directory at ${screenshotsDir}`);
  }
  return screenshotsDir;
}

// Main function
async function run() {
  console.log('Starting Puppeteer...');
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: false, // Set to true if you want to run headless
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    devtools: true // Enable DevTools for debugging
  });
  
  try {
    // Get browser version information
    const version = await browser.version();
    console.log('Browser version info:', version);
    
    // Determine if it's Chrome or Chromium
    const isChromium = version.toLowerCase().includes('chromium');
    const browserType = isChromium ? 'Chromium' : 'Chrome';
    const versionMatch = version.match(/\/(\d+\.\d+\.\d+\.\d+)/);
    const versionNumber = versionMatch ? versionMatch[1] : 'unknown';
    
    console.log(`Browser type: ${browserType}`);
    console.log(`Browser version: ${versionNumber}`);
    
    // Open a new page
    const page = await browser.newPage();
    console.log('Browser opened successfully');
    
    // Set viewport size
    await page.setViewport({ width: 1280, height: 800 });
    
    // Navigate to website
    console.log(`Navigating to ${TARGET_URL}...`);
    await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });
    
    console.log(`✅ Successfully loaded ${TARGET_URL}`);
    
    // Take a screenshot
    const screenshotsDir = ensureScreenshotsDir();
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    const screenshotPath = path.join(screenshotsDir, `screenshot-${timestamp}.png`);
    
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`✅ Screenshot saved to ${screenshotPath}`);
    
    // Start listening for debugger attach
    console.log('Waiting for debugger to attach or timeout (10 minutes)...');
    console.log('To attach a debugger:');
    console.log('1. Open Chrome DevTools');
    console.log('2. Go to chrome://inspect');
    console.log('3. Click "inspect" under the target');
    
    // Set a debugger statement to pause execution when debugger is attached
    // This allows you to inspect the page state in DevTools
    debugger;
    
    // Wait for either debugger or timeout
    const startTime = Date.now();
    await new Promise(resolve => {
      const interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= MAX_WAIT_TIME) {
          clearInterval(interval);
          console.log('⏰ Timeout reached (10 minutes)');
          resolve();
        }
      }, 1000);
      
      // This will run when the debugger continues execution
      // after the debugger statement
      setTimeout(() => {
        console.log('🔍 Debugger was attached and continued execution');
        clearInterval(interval);
        resolve();
      }, 100);
    });
    
  } catch (error) {
    console.error('❌ Error occurred:', error);
  } finally {
    console.log('Closing browser...');
    await browser.close();
    console.log('Browser closed. Script finished.');
  }
}

// Run the script
run().catch(console.error);
