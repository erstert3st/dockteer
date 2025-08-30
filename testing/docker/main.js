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

async function openBrowser() {
  // Launch browser
  const browser = await puppeteer.launch({
    headless: false, // Set to true if you want to run headless
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    devtools: true // Enable DevTools for debugging
  });

  // Get browser version information
  const version = await browser.version();
  const isChromium = version.toLowerCase().includes('chromium');
  const browserType = isChromium ? 'Chromium' : 'Chrome';
  const versionMatch = version.match(/\/(\d+\.\d+\.\d+\.\d+)/);
  const versionNumber = versionMatch ? versionMatch[1] : 'unknown';

  console.log(`Browser type: ${browserType}`);
  console.log(`Browser version: ${versionNumber}`);

  // Open a new page
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });
  console.log(`✅ Successfully loaded ${TARGET_URL}`);
  console.log('Browser opened successfully');
  return { browser, page };
}

async function createScreenshot(page) {

  // Take a screenshot
  const screenshotsDir = ensureScreenshotsDir();
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
  const screenshotPath = path.join(screenshotsDir, `screenshot-${timestamp}.png`);

  await page.screenshot({ path: screenshotPath, fullPage: true })
  console.log(`✅ Screenshot saved to ${screenshotPath}`);

}

// Wait up to `timeoutMs` for a debugger/inspector to be present. Returns a Promise<boolean>.
// Resolves `true` if a debugger/inspector flag or active inspector URL is detected, else `false` after timeout.
function waitForDebuggerOrTimeout(timeoutMs = MAX_WAIT_TIME, pollInterval = 1000) {
  const inspector = require('inspector');
  const start = Date.now();
  return new Promise((resolve) => {
    const check = () => {
      const hasInspectFlag = process.execArgv.some(a => a.startsWith('--inspect'));
      const inspectorActive = !!inspector.url();
      if (hasInspectFlag || inspectorActive) return resolve(true);
      if (Date.now() - start >= timeoutMs) return resolve(false);
      setTimeout(check, pollInterval);
    };
    check();
  });
}
async function main() {
  console.log('Starting Puppeteer...');
  try {
    const { browser, page } = await openBrowser();

    await createScreenshot(page);
    // Start listening for debugger attach
    console.log('Waiting for debugger to attach or timeout (10 minutes)...');


    // Set a debugger statement to pause execution when debugger is attached
    // This allows you to inspect the page state in DevTools
   // debugger;

    // Wait for either debugger or timeout
    console.log(`Will wait for a debugger or until ${new Date(Date.now() + MAX_WAIT_TIME).toLocaleTimeString()}`);
    console.log('Debugger statement placed. If a debugger is attached, execution will pause at the `debugger;` statement.');

    const attached = await waitForDebuggerOrTimeout(MAX_WAIT_TIME);
    if (attached) {
      console.log('✅ Debugger/inspector appears to be attached (or inspector enabled).');
    } else {
      console.log('⏱ No debugger attached within 10 minutes.');
    }


  } catch (error) {
    console.error('❌ Error occurred:', error);
  } finally {
    console.log('Closing browser...');
    await browser.close();
    console.log('Browser closed. Script finished.');
  }
}

// Run the script
main().catch(console.error);
