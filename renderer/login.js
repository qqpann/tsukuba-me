const Store = require('electron-store')
const store = new Store()

const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')

// Store input data
usernameInput.addEventListener('input', (e) => {
    store.set('username', e.target.value)
})
passwordInput.addEventListener('input', (e) => {
    store.set('password', e.target.value)
})

// Load saved data (on DOM load?)
usernameInput.value = store.get('username')
passwordInput.value = store.get('password')