const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch({headless:true, args:['--no-sandbox', '--disable-setuid-sandbox']});
	const page = await browser.newPage();
	await page.goto('https://auth.alipay.com/login/index.htm');
	await page.waitFor('#J-loginMethod-tabs > li:nth-child(2)');
	await page.click('#J-loginMethod-tabs > li:nth-child(2)');
	await page.waitFor('#login');
	await page.type('#J-input-user', '');
	await page.type('#password_rsainput', '');
	
	await page.click('#J-login-btn');
	await page.waitForSelector('#globalContainer').then(() => page.screenshot({path: 'ali.png'}));
	await browser.close();

})();
