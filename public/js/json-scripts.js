document.querySelector('#copyButton').addEventListener('click', async function () {
    var jsonData = document.getElementById('jsonData').textContent;

    try {
        await navigator.clipboard.writeText(jsonData);
        var message = 'El documento JSON fue copiado con éxito!\n\n';

        // Mostrar el mensaje modal
        $('#updateMessage').text(message);
        $('#updateModal').modal('show');
    } catch (err) {
        console.error('Error al copiar el JSON: ', err);
    }
});

document.querySelector('#downloadButton').addEventListener('click', function () {
    var jsonData = document.getElementById('jsonData').textContent;

    var blob = new Blob([jsonData], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});
