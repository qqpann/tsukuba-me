const Store = require('electron-store')
const store = new Store()
const puppeteer = require('puppeteer')

const attendNum = document.getElementById('attend-number')
const attendBtn = document.getElementById('attend-submit')

attendBtn.addEventListener('click', (e) => {
    console.log(attendNum.value)
    attendManaba()
})

const attendManaba = async() => {
    // assert not null
    const username = await store.get('username')
    const password = await store.get('password')
    const attendnum = attendNum.value
  
    const br = await puppeteer.launch({headless: true});
    const page = await br.newPage();
  
    await page.goto('https://atmnb.tsukuba.ac.jp/attend/tsukuba');
    await page.type('input[name="code"]', attendnum);
    await page.click('input[name="insertdb"]');
  
    await page.waitFor('input, .errmsg');
    if (await page.$('div.errmsg')) {
      console.log('FAILED: div.errmsg detected.')
      const out = await page.evaluate(() => document.querySelector('.errmsg').innerText);
      console.log(out)
    } else if (await page.$$eval('input', inputs => inputs.length) == 2) {
      console.log('INFO: attend number successfully received.');
      await page.type('input#username', username);
      await page.type('input#password', password);
      await page.click('button[type="submit"]');
  
      // Wait for the result and show in terminal.
      await page.waitFor('.attend-box-body, .form-error');  // wait for .attend-box-body or .errmsg.
      if (await page.$('.attend-box-body')) {
        console.log('INFO: Successfully authorized.');
        const out = await page.evaluate(() => document.querySelector('.attend-box-body').innerText);
        console.log(out);
      } else if (await page.$('.form-error')) {
        console.log('FAILED: Wrong Username or Password.');
        const out = await page.evaluate(() => document.querySelector('.form-error').innerText);
        //const out = await page.evaluate(() => document.querySelector('.form-error').textContent);
        console.log(out);
      } else {
        console.log('Unknown error');
      }
  
    } else {
      console.log('Unknown error');
    }
  
    //await page.screenshot({path: './atmnb-node.png', fullPage: true});
    br.close();
    
  }