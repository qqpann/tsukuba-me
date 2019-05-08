const links = document.querySelectorAll('link[rel="import"]')
console.log('import js')

// Import and add each page to the DOM
// Thanks: https://github.com/electron/electron-api-demos/blob/2a8c1f46b582b2762c2cf0afc7559082726255b5/assets/imports.js
Array.prototype.forEach.call(links, (link) => {
    let template = link.import.querySelector('.task-template')
    let clone = document.importNode(template.content, true)
    document.querySelector('.content').appendChild(clone)
})