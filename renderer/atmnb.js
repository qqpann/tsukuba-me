const Store = require('electron-store')
const store = new Store()
const puppeteer = require('puppeteer')

const attendNum = document.getElementById('attend-number')
const attendBtn = document.getElementById('attend-submit')

attendBtn.addEventListener('click', (e) => {
    console.log(attendNum.value)
    // assert not null
    const username = store.get('username')
    const password = store.get('password')
    const attendnum = attendNum.value
  
    attendManaba(username, password, attendnum, (text)=>{
      M.toast({html: text, class: 'rounded'})
    })
})

const attendManaba = async(username, password, attendnum, messageCallback, isHeadless = true) => {
    const br = await puppeteer.launch({headless: isHeadless});
    const page = await br.newPage();
  
    await page.goto('https://atmnb.tsukuba.ac.jp/attend/tsukuba');
    await page.type('input[name="code"]', attendnum);
    await page.click('input[name="insertdb"]');
  
    await page.waitFor('input, .errmsg');
    if (await page.$('div.errmsg')) {
      console.log('FAILED: div.errmsg detected.')
      const out = await page.evaluate(() => document.querySelector('.errmsg').innerText);
      console.log(out)
      // 無効な出席番号
      messageCallback(out);
    } else if (await page.$$eval('input', inputs => inputs.length) == 2) {
      console.log('INFO: attend number successfully received.');
      // 出席番号受領した
      // 学籍番号とパスワードを入力
      await page.type('input#username', username);
      await page.type('input#password', password);
      await page.click('button[type="submit"]');
  
      // Wait for the result and show in terminal.
      await page.waitFor('.attend-box-body, .form-error');  // wait for .attend-box-body or .errmsg.
      if (await page.$('.attend-box-body')) {
        console.log('INFO: Successfully authorized.');
        if (await page.$('attendbox-button') && isHeadless) {
          br.close();
          attendManaba(username, password, attendnum, messageCallback, false)
          return
        } else if (await page.$('attendbox-button') && isHeadless) {
          return
        }
        const out = await page.evaluate(() => document.querySelector('.attend-box-body').innerText);
        console.log(out);
        messageCallback(out);
      } else if (await page.$('.form-error')) {
        console.log('FAILED: Wrong Username or Password.');
        const out = await page.evaluate(() => document.querySelector('.form-error').innerText);
        //const out = await page.evaluate(() => document.querySelector('.form-error').textContent);
        console.log(out);
        // 学籍番号またはパスワードが違います
        messageCallback(out);
      } else {
        console.log('Unknown error');
      }
    } else {
      console.log('Unknown error');
    }
  
    //await page.screenshot({path: './atmnb-node.png', fullPage: true});
    br.close();
    
  }