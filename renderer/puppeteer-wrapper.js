const puppeteer = require('puppeteer')
const { app } = require('electron').remote
const keytar = require('keytar')
const Store = require('electron-store')
const store = new Store()

const appName = app.getName()

class PuppeteerWrapper {
    constructor (options) {
        this._options = options || { headless: true }
        this.setUp()
    }

    async setUp () {
        this.username = this.getUsername()
        this.password = this.getPassword()
        this.br = await puppeteer.launch({
            headless: this._options.headless
        })
    }

    getUsername () {
        let username = store.get('username')
        return username
    }

    getPassword () {
        return keytar.getPassword(appName, this.username)
    }

    async newPage () {
        const page = await this.br.newPage()
        return page
    }

    async cleanUp () {
        this.br.close()
    }
}

module.exports.PuppeteerWrapper = PuppeteerWrapper