$(document).ready(function () {
  var table = $("#Censo").DataTable({
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
          "bi bi-eye text-dark-emphasis btn btn-light bg-light-subtle me-2 rounded-3",
        titleAttr: "Visibilidad",
      },
    ],
    dom: "Bfrtip",
    paging: false,
    scrollCollapse: true,
    scrollX: true,
    scrollY: 500,
    order: [[1, "asc"]],

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

  // Add row selection functionality
  table.on("click", "tbody tr", function (e) {
    e.currentTarget.classList.toggle("selected");
  });
});
