import puppeteer from 'puppeteer';
import * as fs from 'fs';
const password = fs.readFileSync('/tmp/ADMIN_PASS','utf8');
const url = process.argv[2];
const HOST = process.argv[3] || 'app'; // **important**
(async () => {
  if(url === undefined) {
    console.log('Usage: node visitor.py URL')
    process.exit(-1);
  }
  console.log(`url=${url}`);
  const u = new URL(url);
  if (u.protocol != 'http:' || u.host != HOST || !/^\/api\/announcement\/.+/.test(u.pathname)) {
    console.log(`sus url, must protocol = http://, host = ${HOST}, pathname /api/announcement/{postid}`);
    process.exit(-1);
  }
  // Launch Firefox instead of Chromium
  const browser = await puppeteer.launch({
    browser: 'firefox',
    headless: true, // set to true if you don't want to see the browser
    extraPrefsFirefox: {
    'network.stricttransportsecurity.preloadlist': false, // disable auto https
    'dom.security.https_only_mode': false,
    'dom.security.https_first': false,
    'dom.serviceWorkers.enabled': true,
    'dom.serviceWorkers.testing.enabled': true, // allow SW on http: **important**
  }
  });

  const page = await browser.newPage();


  // Step 1: Go to Login
  await page.goto(`http://${HOST}/login`, { waitUntil: 'networkidle2' });
  console.log('login')
  // Step 2: Login as admin
  // Adjust selectors based on the actual login form structure
  await page.type('#username', 'admin');
  await page.type('#password', password);
  await Promise.all([
    page.click('#submit'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);
  console.log('Go to next')
  // Step 3: Navigate to /announcement
  await page.goto(url, { timeout:5000, waitUntil: 'networkidle2' });
  await browser.close();
  process.exit(0);
})();