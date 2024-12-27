$(document).ready(function () {
    var table = $('#Censo').DataTable({
        language: {
            url: '/js/i18n/es-CO.json'
        },
        buttons: [
            {
                text: '<i class="bi bi-clipboard text-primary-emphasis"> Copiar filas</i>',
                className: 'btn btn-primary bg-primary-subtle me-2 rounded-3',
                titleAttr: 'Copiar',
                action: async function () {
                    var selectedData = table.rows('.selected').data().toArray();

                    // If no rows are selected, copy all data
                    if (selectedData.length === 0) {
                        selectedData = table.rows().data().toArray();
                    }

                    // Generate message for the modal
                    var message = selectedData.length + ' filas copiadas con éxito\n\n';

                    // Copy selected data to clipboard
                    var clipboardData = selectedData.map(function (row) {
                        return row.join('\t');
                    }).join('\n');

                    try {
                        await navigator.clipboard.writeText(clipboardData);
                    } catch (err) {
                        console.error('Error al copiar al portapapeles: ', err);
                    }

                    // Show the message modal
                    $('#updateMessage').text(message);
                    $('#updateModal').modal('show');
                }
            },
            { extend: 'pdf', text: '<i class="bi bi-file-pdf text-danger-emphasis"> Exportar a PDF</i>', className: 'btn btn-danger bg-danger-subtle me-2 rounded-3', titleAttr: 'PDF' },
            { extend: 'print', text: '<i class="bi bi-printer text-secondary-emphasis"> Imprimir</i>', className: 'btn btn-secondary bg-secondary-subtle me-2 rounded-3', titleAttr: 'Imprimir' },
            { extend: 'colvis', text: '<i class="bi bi-eye text-dark-emphasis"> Columnas visibles</i>', className: 'btn btn-light bg-light-subtle me-2 btn-sm me-2 rounded-3', titleAttr: 'Visibilidad' }
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
                    let column = this;
                    let title = column.footer().textContent;

                    // Create input element
                    let input = document.createElement('input');
                    input.placeholder = title;
                    column.footer().replaceChildren(input);

                    // Event listener for user input
                    input.addEventListener('keyup', () => {
                        if (column.search() !== this.value) {
                            column.search(input.value).draw();
                        }
                    });
                });
        }
    });

    $('#submit').on('click', function (e) {
        e.preventDefault();

        // Desactivar redibujado automático
        $.fn.dataTable.ext.errMode = 'none'; // Desactivar mensajes de error para prevenir bloqueos
        var updatedData = [];

        // Realizar las actualizaciones en lotes
        var batchSize = 100;
        var rows = $('#Censo tbody tr');
        var totalRows = rows.length;
        var batches = Math.ceil(totalRows / batchSize);

        function processBatch(batchIndex) {
            var start = batchIndex * batchSize;
            var end = start + batchSize;
            var batchRows = rows.slice(start, end);

            batchRows.each(function () {
                var row = table.row(this).data();
                // var cedulaTitular = $(this).find('td:eq(0) input').val();
                // var departamento = $(this).find('td:eq(1) input').val();
                // var municipio = $(this).find('td:eq(2) input').val();
                // var codMunicipio = $(this).find('td:eq(3) input').val();
                // var resguardo = $(this).find('td:eq(4) input').val();
                var comunidad = $(this).find('td:eq(5) input').val();
                var cabildo = $(this).find('td:eq(6) input').val();
                var puebloIndigena = $(this).find('td:eq(7) input').val();
                var estadoHogar = $(this).find('td:eq(8) input').val();
                var titularAvalado = $(this).find('td:eq(9) select').val();
                var nombreCabildo = $(this).find('td:eq(10) input').val();

                // Actualiza el DataTable con el nuevo valor
                var rowIdx = table.row(this).index();
                // table.cell(rowIdx, 0).data(cedulaTitular);
                // table.cell(rowIdx, 1).data(departamento);
                // table.cell(rowIdx, 2).data(municipio);
                // table.cell(rowIdx, 3).data(codMunicipio);
                // table.cell(rowIdx, 4).data(resguardo);
                table.cell(rowIdx, 5).data(comunidad);
                table.cell(rowIdx, 6).data(cabildo);
                table.cell(rowIdx, 7).data(puebloIndigena);
                table.cell(rowIdx, 8).data(estadoHogar);
                table.cell(rowIdx, 9).data(titularAvalado);
                table.cell(rowIdx, 10).data(nombreCabildo);

                updatedData.push({
                    // 'CEDULA TITULAR': cedulaTitular,
                    // 'DEPARTAMENTO': departamento,
                    // 'MUNICIPIO': municipio,
                    // 'CODMUNICIPIO': codMunicipio,
                    // 'RESGUARDO': resguardo,
                    'COMUNIDAD': comunidad,
                    'CABILDO': cabildo,
                    'PUEBLOINDIGENA': puebloIndigena,
                    'ESTADOHOGAR': estadoHogar,
                    'TITULAR AVALADO SI o NO': titularAvalado,
                    'NOMBRE DEL CABILDO': nombreCabildo
                });
            });

            // Dibujar tabla después de cada lote
            if (batchIndex < batches - 1) {
                setTimeout(function () {
                    processBatch(batchIndex + 1);
                }, 0);
            } else {
                // Redibujar tabla completa al finalizar todos los lotes
                table.draw();

                // Generar mensaje para el modal
                var message;
                if (updatedData.length <= 5) {
                    message = 'Actualización completada para los siguientes titulares:\n\n';
                    updatedData.forEach(function (item) {
                        message += 'El titular con cedula: ' + item['CEDULA TITULAR'] + '\n';
                    });
                } else {
                    message = 'Actualización completada para ' + updatedData.length + ' registros.';
                }

                // Mostrar el mensaje modal
                $('#updateMessage').text(message);
                $('#updateModal').modal('show');
            }
        }

        // Iniciar procesamiento por lotes
        processBatch(0);
    });
});
