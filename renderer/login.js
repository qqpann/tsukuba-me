const { app } = require('electron').remote
const keytar = require('keytar')
const Store = require('electron-store')
const store = new Store()

const appName = app.getName() // will deprecate. use app.name in the future
const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')
const loginBtn = document.getElementById('login-btn')
let username = null
let password = null

// Store input data
const getUsername = (usernameTarget) => {
    return usernameTarget.value
}
const getPassword = (passwordTarget) => {
    return passwordTarget.value
}

usernameInput.addEventListener('input', (e) => {
    username = getUsername(e.target)
    store.set('username', username)
})
passwordInput.addEventListener('input', (e) => {
    // password = getPassword(e.target)
})
loginBtn.addEventListener('click', (e) => {
    username = getUsername(usernameInput)
    password = getPassword(passwordInput)
    keytar.setPassword(appName, username, password)
})

// Load saved data (on DOM load?)
usernameInput.value = store.get('username')
passwordInput.value = store.get('password')