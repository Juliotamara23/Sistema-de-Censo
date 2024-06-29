$(document).ready(function () {
    var table = $('#Censo').DataTable({
        language: {
            url: '/js/i18n/es-CO.json'
        },
        buttons: [
            { extend: 'copy', text: '<i class="bi bi-files text-primary-emphasis"></i>', className: 'btn btn-primary bg-primary-subtle btn-sm me-2 btn-sm me-2 rounded-3', titleAttr: 'Copiar' },
            { extend: 'excel', text: '<i class="bi bi-file-spreadsheet text-success-emphasis"></i>', className: 'btn btn-success bg-success-subtle btn-sm me-2 btn-sm me-2 rounded-3', titleAttr: 'Excel' },
            { extend: 'pdf', text: '<i class="bi bi-file-pdf text-danger-emphasis"></i>', className: 'btn btn-danger bg-danger-subtle btn-sm me-2 btn-sm me-2 rounded-3', titleAttr: 'PDF' },
            { extend: 'print', text: '<i class="bi bi-printer text-secondary-emphasis"></i>', className: 'btn btn-secondary bg-secondary-subtle btn-sm me-2 btn-sm me-2 rounded-3', titleAttr: 'Imprimir' },
            { extend: 'colvis', text: '<i class="bi bi-eye text-dark-emphasis"></i>', className: 'btn btn-light bg-light-subtle btn-sm me-2 btn-sm me-2 rounded-3', titleAttr: 'Visibilidad' }
        ],
        dom: 'Bfrtip',
        paging: false,
        scrollCollapse: true,
        scrollX: true,
        scrollY: 500,
        order: [[1, 'asc']],
        
        initComplete: function () {
            this.api()
                .columns()
                .every(function () {
                    let column = this
                    let title = column.footer().textContent

                    // Create input element
                    let input = document.createElement('input')
                    input.placeholder = title;
                    column.footer().replaceChildren(input);

                    // Event listener for user input
                    input.addEventListener('keyup', () => {
                        if (column.search() !== this.value) {
                            column.search(input.value).draw()
                        }
                    });
                });
        }
    });

    // Add row selection functionality
    table.on('click', 'tbody tr', function (e) {
        e.currentTarget.classList.toggle('selected')
    })

    // Add button click functionality
    document.querySelector('#button').addEventListener('click', async function () {
        var selectedData = table.rows('.selected').data().toArray();
        
        // Generate message for the modal
        var message = selectedData.length + ' filas copiadas con éxito\n\n'

        // Copy selected data to clipboard
        var clipboardData = selectedData.map(function(row) {
            return row.join('\t');
        }).join('\n')

        try {
            await navigator.clipboard.writeText(clipboardData)
        } catch (err) {
            console.error('Error al copiar al portapapeles: ', err)
        }

        // Show the message modal
        $('#updateMessage').text(message)
        $('#updateModal').modal('show')
    });
});
