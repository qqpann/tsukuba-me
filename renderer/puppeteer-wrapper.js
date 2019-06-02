const puppeteer = require('puppeteer')
const { app } = require('electron').remote
const keytar = require('keytar')
const Store = require('electron-store')
const store = new Store()

const appName = app.getName()

class PuppeteerWrapper {
    constructor (options) {
        this._options = options || { headless: true }
    }

    async setUp () {
        this.username = await this._getUsername()
        this.password = await this._getPassword()
        this.br = await puppeteer.launch({
            headless: this._options.headless,
            executablePath: this._getChromiumExecPath()
        })
    }

    async _getUsername () {
        let username = store.get('username')
        return username
    }

    async _getPassword () {
        return keytar.getPassword(appName, this.username)
    }

    _getChromiumExecPath () {
        return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked')
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