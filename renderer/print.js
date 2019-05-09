const Store = require('electron-store')
const store = new Store()
const puppeteer = require('puppeteer')

const printsInput = document.getElementById('prints')
const printsUploadBtn = document.getElementById('print-upload')

let files = new Array()

printsInput.addEventListener('input', (e) => {
    console.log(e.target.files)
    Array.prototype.forEach.call(e.target.files, (file) => {
        files.push(file.path)
    })
    console.log(files)
})

printsUploadBtn.addEventListener('click', (e) => {
    uploadPrint(username, password)
})

const uploadPrint = async() => {
    // assert not null
    const username = await store.get('username')
    const password = await store.get('password')
  
    const br = await puppeteer.launch({headless: true});
    const page = await br.newPage();
    await page.setViewport({width: 1000, height: 800});
  
    await page.goto('https://papercut-p01.u.tsukuba.ac.jp:9192/user');
    await page.type('input#inputUsername', username);
    await page.type('input#inputPassword', password);
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
        //await page.screenshot({path: '/Users/qiushi/Desktop/tmp.png', fullPage: true});
        br.close();
    } else {
        console.log('Unknown error');
    }
}