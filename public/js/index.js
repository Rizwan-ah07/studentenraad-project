document.getElementById('anonymous').addEventListener('change', function () {
    const username = this.getAttribute('data-username');
    if (this.checked) {
        document.getElementById('author').value = "Anoniem";
    }
    else {
        document.getElementById('author').value = username;
    }
});