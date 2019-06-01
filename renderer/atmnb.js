const Store = require('electron-store')
const store = new Store()
const puppeteer = require('puppeteer')

const attendNum = document.getElementById('attend-number')
const attendBtn = document.getElementById('attend-submit')

attendBtn.addEventListener('click', (e) => {
    // assert not null
    const username = store.get('username')
    const password = store.get('password')
    const attendnum = attendNum.value
  
    const feedbackMessage = (text) => {
      M.toast({html: text, class: 'rounded'})
    } 
    let atmnb = attendManaba(username, password, attendnum, feedbackMessage)
    atmnb.then((needFill)=>{
      if (needFill) {
        attendManaba(username, password, attendnum, feedbackMessage, false)
      }
    })
})

const attendManaba = async(username, password, attendnum, messageCallback, isHeadless = true) => {
    const br = await puppeteer.launch({
      headless: isHeadless,
    });
    const page = await br.newPage();
  
    await page.goto('https://atmnb.tsukuba.ac.jp/attend/tsukuba');
    await page.type('input[name="code"]', attendnum);
    await page.click('input[name="insertdb"]');
  
    await page.waitFor('input, .errmsg');
    if (await page.$('div.errmsg')) {
      console.log('FAILED: div.errmsg detected.')
      const out = await page.evaluate(() => document.querySelector('.errmsg').innerText);
      // 無効な出席番号
      messageCallback(out);
      return null
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
        // attendbox-buttonがある場合、出席番号以外の
        // アンケートや番号回答などが必要
        if (await page.$('attendbox-button') && isHeadless) {
          return true
        } else if (await page.$('attendbox-button') && isHeadless) {
          return null
        }
        // それがなければ、無事出席完了
        const out = await page.evaluate(() => document.querySelector('.attend-box-body').innerText);
        messageCallback(out);
        return null
      } else if (await page.$('.form-error')) {
        console.log('FAILED: Wrong Username or Password.');
        const out = await page.evaluate(() => document.querySelector('.form-error').innerText);
        //const out = await page.evaluate(() => document.querySelector('.form-error').textContent);
        // 学籍番号またはパスワードが違います
        messageCallback(out);
        return null
      } else {
        console.log('Unknown error');
        return new Error('Unknown error')
      }
    } else {
      console.log('Unknown error');
      return new Error('Unknown error')
    }
  
    if (isHeadless) {
      br.close()
    }
  }