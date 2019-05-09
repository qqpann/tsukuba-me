const Store = require('electron-store')
const store = new Store()

// Thanks: https://github.com/electron/electron-api-demos/blob/2a8c1f46b582b2762c2cf0afc7559082726255b5/assets/nav.js

document.body.addEventListener('click', (e) => {
    if (e.target.dataset.modal) handleModalTrigger(e)
})

const handleModalTrigger = (e) => {
    hideAllModals()
    // activate Nav tab
    e.target.classList.add('active')
    const modalId = `${e.target.dataset.modal}-modal`
    document.getElementById(modalId).classList.add('is-shown')
}

const hideAllModals = () => {
    const modalDatas = document.querySelectorAll('.tab')
    Array.prototype.forEach.call(modalDatas, (md) => {
        md.querySelector('a').classList.remove('active')
    })
    const modals = document.querySelectorAll('.my-modal.is-shown')
    Array.prototype.forEach.call(modals, (modal) => {
        modal.classList.remove('is-shown')
    })
}