const printsInput = document.getElementById('prints')
const printsUploadBtn = document.getElementById('print-upload')

printsInput.addEventListener('input', (e) => {
    console.log(e.target.files)
})