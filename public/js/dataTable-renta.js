$(document).ready(function () {
  var table = $("#Censo").DataTable({
    serverSide: true, // Procesamiento del lado del servidor
    ajax: {
      url: "/api/renta-data",
      type: "POST",
      dataSrc: function (json) {
        return json.data || [];
      },
    },
    columns: [
      { data: "CEDULA TITULAR" },
      { data: "DEPARTAMENTO" },
      { data: "MUNICIPIO" },
      { data: "CODMUNICIPIO" },
      { data: "RESGUARDO" },
      { data: "COMUNIDAD" },
      { data: "CABILDO" },
      { data: "PUEBLOINDIGENA" },
      { data: "ESTADOHOGAR" },
      { data: "TITULAR AVALADO SI o NO" },
      { data: "NOMBRE DEL CABILDO" },
    ],
    deferRender: true,
    scrollY: 500,
    scrollCollapse: true,
    scrollX: true,
    paging: false,
    dom: "Bfrtip",
    language: {
      url: "/js/i18n/es-CO.json",
    },
    buttons: [
      {
        text: " Copiar filas",
        className:
          "bi bi-clipboard text-primary-emphasis btn btn-primary bg-primary-subtle me-2 rounded-3",
        titleAttr: "Copiar",
        action: async function () {
          var selectedData = table.rows(".selected").data().toArray();

          // If no rows are selected, copy all data
          if (selectedData.length === 0) {
            selectedData = table.rows().data().toArray();
          }

          // Generate message for the modal
          var message = selectedData.length + " filas copiadas con éxito\n\n";

          // Copy selected data to clipboard
          var clipboardData = selectedData
            .map(function (row) {
              return row.join("\t");
            })
            .join("\n");

          try {
            await navigator.clipboard.writeText(clipboardData);
          } catch (err) {
            console.error("Error al copiar al portapapeles: ", err);
          }

          // Show the message modal
          $("#updateMessage").text(message);
          $("#updateModal").modal("show");
        },
      },
      {
        extend: "pdf",
        text: " Exportar a PDF",
        className:
          "bi bi-file-pdf text-danger-emphasis btn btn-danger bg-danger-subtle me-2 rounded-3",
        titleAttr: "PDF",
      },
      {
        extend: "print",
        text: " Imprimir",
        className:
          "bi bi-printer text-secondary-emphasis btn btn-secondary bg-secondary-subtle me-2 rounded-3",
        titleAttr: "Imprimir",
      },
      {
        extend: "colvis",
        text: " Columnas visibles",
        className:
          "bi bi-eye text-dark-emphasis btn btn-light bg-light-subtle me-2 btn-sm me-2 rounded-3",
        titleAttr: "Visibilidad",
      },
    ],

    initComplete: function () {
      // Debounce para la búsqueda
      var searchTimeout;
      this.api()
        .columns()
        .every(function () {
          let column = this;
          let title = column.footer().textContent;

          let input = document.createElement("input");
          input.placeholder = title;
          column.footer().replaceChildren(input);

          input.addEventListener("keyup", () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
              if (column.search() !== input.value) {
                column.search(input.value).draw();
              }
            }, 300);
          });
        });
    },
  });

  // Optimizar actualización por lotes
  $("#submit").on("click", function (e) {
    e.preventDefault();

    const BATCH_SIZE = 100;
    const rows = $("#Censo tbody tr").toArray();
    const totalRows = rows.length;
    let processedRows = 0;

    function processBatchAsync(startIndex) {
      return new Promise((resolve) => {
        const endIndex = Math.min(startIndex + BATCH_SIZE, totalRows);
        const batch = rows.slice(startIndex, endIndex);
        requestAnimationFrame(() => {
          batch.forEach(processRow);
          processedRows += batch.length;

          // Actualizar progreso
          updateProgress(processedRows / totalRows);
          resolve();
        });
      });
    }

    async function processAllBatches() {
      for (let i = 0; i < totalRows; i += BATCH_SIZE) {
        await processBatchAsync(i);
      }

      // Actualización final
      table.draw();
      showUpdateModal();
    }

    processAllBatches();
  });

  function processRow(row) {
    // Lógica de procesamiento de fila optimizada
    const $row = $(row);
    const rowData = {
      comunidad: $row.find("td:eq(5) input").val(),
      cabildo: $row.find("td:eq(6) input").val(),
      puebloIndigena: $row.find("td:eq(7) input").val(),
      estadoHogar: $row.find("td:eq(8) input").val(),
      titularAvalado: $row.find("td:eq(9) select").val(),
      nombreCabildo: $row.find("td:eq(10) input").val(),
    };

    // Actualizar DataTable de manera eficiente
    const rowIdx = table.row(row).index();
    Object.entries(rowData).forEach(([key, value], colIdx) => {
      table.cell(rowIdx, colIdx + 5).data(value);
    });

    return rowData;
  }
});
