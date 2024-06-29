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
