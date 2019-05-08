const Store = require('electron-store')
const store = new Store()

// Thanks: https://github.com/electron/electron-api-demos/blob/2a8c1f46b582b2762c2cf0afc7559082726255b5/assets/nav.js

document.body.addEventListener('click', (e) => {
    if (e.target.dataset.modal) handleModalTrigger(e)
})

const handleModalTrigger = (e) => {
    hideAllModals()
    const modalId = `${e.target.dataset.modal}-modal`
    document.getElementById(modalId).classList.add('is-shown')
}

const hideAllModals = () => {
    const modals = document.querySelectorAll('.modal.is-shown')
    Array.prototype.forEach.call(modals, (modal) => {
        modal.classList.remove('is-shown')
    })
}