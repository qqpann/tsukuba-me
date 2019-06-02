const { PuppeteerWrapper } = require('./puppeteer-wrapper')

const printsInput = document.getElementById('prints')
const printsUploadBtn = document.getElementById('print-upload')


printsUploadBtn.addEventListener('click', (e) => {
    const files = new Array()
    Array.prototype.forEach.call(printsInput.files, (file) => {
        files.push(file.path)
    })
    uploadPrint(files)
})

const uploadPrint = async(files) => {
    const pw = new PuppeteerWrapper()
    await pw.setUp()
    const page = await pw.newPage();

    await page.setViewport({width: 1000, height: 800});
  
    await page.goto('https://papercut-p01.u.tsukuba.ac.jp:9192/user');
    console.log(pw.username + pw.password)
    await page.type('input#inputUsername', pw.username);
    await page.type('input#inputPassword', pw.password);
    await page.click('input[type="submit"]');
  
    await page.waitFor('a#linkUserWebPrint, .errorMessage');
    if (await page.$('.errorMessage')) {
        const out = await page.evaluate(() => document.querySelector('.errorMessage').innerText);
        console.log(out);
    } else if (await page.$('a#linkUserWebPrint')) {
        await page.click('a#linkUserWebPrint');
    
        await page.waitFor('a.web-print-start');
        await page.click('a.web-print-start');
    
        await page.waitFor('#main > div.wizard > form > div.buttons > input.right');
        await page.click('#main > div.wizard > form > div.buttons > input.right');
    
        console.log(files)
        await page.waitFor('#upload');
        const elementHandle = await page.$('body > input[type="file"]');
        await elementHandle.uploadFile(...files);
        await page.click('#upload');
    
        await page.waitFor('.infoMessage');
        const infoMsg = await page.evaluate(() => document.querySelector('.infoMessage').innerText);
        console.log(infoMsg);
        const printJobs = await page.evaluate(() => document.querySelector('#main > div.web-print-intro > div:nth-child(3) > span > table').innerText);
        console.log(printJobs);
    } else {
        console.log('Unknown error');
    }
    pw.cleanUp()
}