$(document).ready(function () {
  var table = $("#Renta").DataTable({
    language: {
      url: "/js/i18n/es-CO.json",
    },
    serverSide: true, // Procesamiento del lado del servidor
    ajax: {
      url: "/api/renta-data",
      type: "POST",
      dataSrc: function (json) {
        // Ocultar el mensaje de carga y mostrar la tabla cuando los datos estén listos
        $("#loadingMessage").hide();
        $("#Renta").show();
        return json.data || [];
      },
    },
    columns: [
      { data: "CEDULA TITULAR" },
      { data: "DEPARTAMENTO" },
      { data: "MUNICIPIO" },
      { data: "CODMUNICIPIO" },
      {
        data: "RESGUARDO",
        render: function (data, type, row) {
          return `<input type="text" class="form-control" value="${data}">`;
        },
      },
      {
        data: "COMUNIDAD",
        render: function (data, type, row) {
          return `<input type="text" class="form-control" value="${data}">`;
        },
      },
      {
        data: "CABILDO",
        render: function (data, type, row) {
          return `<input type="text" class="form-control" value="${data}">`;
        },
      },
      {
        data: "PUEBLOINDIGENA",
        render: function (data, type, row) {
          return `<input type="text" class="form-control" value="${data}">`;
        },
      },
      {
        data: "ESTADOHOGAR",
        render: function (data, type, row) {
            return `<input type="text" class="form-control" value="${data}">`;
          },
          },
          {
          data: "TITULAR AVALADO SI o NO",
          render: function (data, type, row) {
            return `<input type="text" class="form-control" value="${data}">`;
          },
          },
          {
          data: "NOMBRE DEL CABILDO",
          render: function (data, type, row) {
          return `<input type="text" class="form-control" value="${data}">`;
        },
      },
    ],
    deferRender: true,
    dom: "Bfrtip",
    paging: false,
    scrollCollapse: true,
    scrollX: true,
    scrollY: 500,
    order: [[1, "asc"]],
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
              return Object.values(row).join("\t");
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
      this.api()
        .columns()
        .every(function () {
          let column = this;
          let title = column.footer().textContent;

          // Create input element
          let input = document.createElement("input");
          input.placeholder = title;
          column.footer().replaceChildren(input);

          // Event listener for user input
          input.addEventListener("keyup", () => {
            if (column.search() !== this.value) {
              column.search(input.value).draw();
            }
          });
        });
    },
  });
});