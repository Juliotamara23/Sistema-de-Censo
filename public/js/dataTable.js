$(document).ready(function() {
    $('#Censo').DataTable({
        language: {
            url: '/js/i18n/es-CO.json'
        },
        buttons: [
            { extend: 'copy', text: '<i class="bi bi-files text-primary-emphasis"></i>', className: 'btn btn-primary bg-primary-subtle btn-sm me-2 rounded-3', titleAttr: 'Copiar' },
            { extend: 'excel', text: '<i class="bi bi-file-spreadsheet text-success-emphasis"></i>', className: 'btn btn-success bg-success-subtle btn-sm me-2 btn-sm me-2 rounded-3', titleAttr: 'Excel' },
            { extend: 'pdf', text: '<i class="bi bi-file-pdf text-danger-emphasis"></i>', className: 'btn btn-danger bg-danger-subtle btn-sm me-2 btn-sm me-2 rounded-3', titleAttr:'PDF' },
            { extend: 'print', text: '<i class="bi bi-printer text-secondary-emphasis"></i>', className: 'btn btn-secondary bg-secondary-subtle btn-sm me-2 btn-sm me-2 rounded-3', titleAttr: 'Imprimir' },
            { extend: 'colvis', text: '<i class="bi bi-eye text-dark-emphasis"></i>', className: 'btn btn-dark bg-dark-subtle border border-dark-subtle btn-sm me-2 btn-sm me-2 rounded-3', titleAttr: 'Visibilidad' }
        ],
        dom: 'Bfrtip', // Definir los elementos a mostrar
        lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "Todos"] ], // Opciones de número de registros por página
        pageLength: 10, // Número de registros por página por defecto
        scrollX: true,
        scrollY: 500
    });
});
