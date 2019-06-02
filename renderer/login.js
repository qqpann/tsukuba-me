const { app } = require('electron').remote
const keytar = require('keytar')
const Store = require('electron-store')
const store = new Store()

const appName = app.getName() // will deprecate. use app.name in the future
const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')
const loginBtn = document.getElementById('login-btn')

// Store input data
loginBtn.addEventListener('click', (e) => {
    const username = usernameInput.value
    const password = passwordInput.value
    store.set('username', username)
    keytar.setPassword(appName, username, password)

    passwordInput.value = null
})

// Load saved data (on DOM load?)
usernameInput.value = store.get('username')