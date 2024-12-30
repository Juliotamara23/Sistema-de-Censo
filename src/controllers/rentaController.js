import XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

let processedRentaData = [];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapeo de nombres de columnas vacías a nombres descriptivos
const columnMapping = {
  __EMPTY: "CEDULA TITULAR",
  __EMPTY_1: "DEPARTAMENTO",
  __EMPTY_2: "MUNICIPIO",
  __EMPTY_3: "CODMUNICIPIO",
  __EMPTY_4: "RESGUARDO",
  __EMPTY_5: "COMUNIDAD",
  __EMPTY_6: "CABILDO",
  __EMPTY_7: "PUEBLOINDIGENA",
  __EMPTY_8: "ESTADOHOGAR",
  __EMPTY_9: "TITULAR        AVALADO                                SI o NO",
  __EMPTY_10: "NOMBRE DEL CABILDO",
};

// Función para convertir Excel a JSON
const excelToJson = (data) => {
  let workbook = XLSX.read(data, { type: "array" });
  let jsonData = [];
  workbook.SheetNames.forEach((sheet) => {
    let rowObject = XLSX.utils.sheet_to_row_object_array(
      workbook.Sheets[sheet]
    );
    jsonData.push(...rowObject);
  });
  return jsonData;
};

// Función para procesar los datos de Excel y formatearlos
const processExcelDataRenta = (data) => {
  const jsonData = excelToJson(data);
  const formattedData = jsonData.reduce((acc, dato) => {
    let formattedDato = {};
    Object.keys(dato).forEach((key) => {
      if (columnMapping[key]) {
        if (dato[key] !== columnMapping[key]) {
          if (columnMapping[key] === "FECHA NACIMIENTO") {
            formattedDato[columnMapping[key]] = new Date(
              (dato[key] - (25567 + 2)) * 86400 * 1000
            ).toLocaleDateString();
          } else {
            formattedDato[columnMapping[key]] = dato[key];
          }
        }
      }
    });
    if (Object.keys(formattedDato).length > 0) {
      acc.push(formattedDato);
    }
    return acc;
  }, []);
  return formattedData;
};

export const renderExcelJsonRenta = (req, res) => {
  res.render("excel_json", {
    title: "Cargar y Procesar Excel a JSON",
    data: [],
  });
};

export const renderTableRenta = (req, res) => {
  res.render("table_renta", { title: "Tabla de Renta", data: [] });
};

export const uploadAndProcessExcelRenta = async (req, res) => {
  try {
    if (!req.files || !req.files.excelFile) {
      throw new Error("No file uploaded");
    }
    const file = req.files.excelFile; // Se asume que el archivo se envía con el campo 'excelFile'
    const data = await fs.readFile(file.tempFilePath);
    const formattedData = processExcelDataRenta(data);

    // Procesamiento de los datos en memoria
    processedRentaData = formattedData;

    const { viewType } = req.body; // Obtener el tipo de vista seleccionado por el usuario

    if (viewType === "1") {
      res.render("excel_json", {
        title: "Datos de la Renta en JSON",
        data: formattedData,
      });
    } else if (viewType === "2") {
      res.render("table_renta", {
        title: "Tabla de Renta",
        data: formattedData,
      });
    } else {
      res.status(400).send("Invalid view type selected");
    }
  } catch (error) {
    console.error("Error processing Excel file:", error);
    res.status(500).render("excel_json", {
      title: "Cargar y Procesar Excel a JSON",
      error: "Ocurrió un error al procesar el archivo Excel.",
      data: [],
    });
  }
};

export const getRentaData = (req, res) => {
  try {
    // Verificar si hay datos procesados
    if (!processedRentaData.length) {
      return res.status(400).json({
        error: "No data available. Please upload an Excel file first.",
      });
    }

    // Obtener los parametros de la datatable
    const draw = parseInt(req.body.draw);
    const start = parseInt(req.body.start);
    const length = parseInt(req.body.length);
    const searchValue = req.body.search?.value || "";

    // Filtrar datos por busqueda
    const filteredData = processedRentaData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchValue.toLowerCase())
      )
    );

    // Paginar datos
    const paginatedData = filteredData.slice(start, start + length);

    // Formatear datos para la datatable

    res.json({
      draw: draw,
      recordsTotal: processedRentaData.length,
      recordsFiltered: filteredData.length,
      data: paginatedData,
    });
  } catch (error) {
    console.log("Error fetching data:", error);
    res.status(500).json({ error: "Error processing data" });
  }
};
