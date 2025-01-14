import XLSX from "xlsx";
import fs from "fs/promises";

let processedRentaData = [];

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
  __EMPTY_9: "TITULAR AVALADO SI o NO",
  __EMPTY_10: "NOMBRE DEL CABILDO",
};

// Función para convertir Excel a JSON
const excelToJson = async (data) => {
  let workbook = await XLSX.read(data, { type: "array" });
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
const processExcelDataRenta = async (data) => {
  try {
    const jsonData = await excelToJson(data);

    // Filtrar filas válidas - verificar si al menos un campo __EMPTY tiene contenido numérico
    const validData = jsonData.filter((row) => {
      return Object.keys(row).some((key) => {
        if (key.startsWith("__EMPTY")) {
          const value = row[key];
          // Verificar si el valor es numérico (incluyendo números en formato string)
          return value !== undefined && value !== null && value !== '' && !isNaN(value);
        }
        return false;
      });
    });

    const formattedData = validData.map((row) => {
      const formattedDato = {};
      
      // Mapeo de columnas
      Object.entries(columnMapping).forEach(([key, mappedKey]) => {
        const value = row[key];
        // Convertir a string y recortar solo si el valor existe
        formattedDato[mappedKey] = value !== undefined && value !== null && value !== ''
          ? String(value).trim()
          : "";
      });
      
      return formattedDato;
    });

    // Validación de datos procesados	
    if (!formattedData.length) {
      throw new Error('No se encontraron datos válidos después del procesamiento');
    }

    return formattedData;
  } catch (error) {
    console.error('Error en processExcelDataRenta:', error);
    throw error;
  }
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
    const formattedData = await processExcelDataRenta(data);

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

export const getRentaData = async (req, res) => {
  try {
    // Verificar si hay datos procesados
    if (!processedRentaData || !processedRentaData.length) {
      return res.status(400).json({
        error: "No data available. Please upload an Excel file first.",
      });
    }

    // Obtener los parametros de la datatable
    const draw = parseInt(req.body.draw);
    const searchValue = req.body.search?.value || "";

    // Filtrar datos por busqueda
    const filteredData = processedRentaData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchValue.toLowerCase())
      )
    );

    // Formateo de datos para el datatable
    res.json({
      draw: draw,
      recordsTotal: processedRentaData.length,
      recordsFiltered: filteredData.length,
      data: filteredData, // Manda la información filtrada
    });
  } catch (error) {
    console.log("Error fetching data:", error);
    res.status(500).json({ error: "Error processing data" });
  }
};
