const printsInput = document.getElementById('prints')

printsInput.addEventListener('input', (e) => {
    console.log(e.target.files)
})