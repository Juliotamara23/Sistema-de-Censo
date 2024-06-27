import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapeo de nombres de columnas vacías a nombres descriptivos
const columnMapping = {
  "__EMPTY_1": "RESGUARDO INDIGENA",
  "__EMPTY_2": "COMUNIDAD INDIGENA",
  "__EMPTY_3": "FAMILIA",
  "__EMPTY_4": "TIPO IDENTIFICACION",
  "__EMPTY_5": "NUMERO DOCUMENTO",
  "__EMPTY_6": "NOMBRE",
  "__EMPTY_7": "APELLIDOS",
  "__EMPTY_8": "FECHA NACIMIENTO",
  "__EMPTY_9": "PARENTESCO",
  "__EMPTY_10": "SEXO",
  "__EMPTY_11": "ESTADO CIVIL",
  "__EMPTY_12": "PROFESION",
  "__EMPTY_13": "ESCOLARIDAD",
  "__EMPTY_14": "INTEGRANTES",
  "__EMPTY_15": "DIRECCION",
  "__EMPTY_16": "USUARIO"
};

// Función para convertir Excel a JSON
const excelToJson = (data) => {
  let workbook = XLSX.read(data, { type: 'array' });
  let jsonData = [];
  workbook.SheetNames.forEach((sheet) => {
    let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
    jsonData.push(...rowObject);
  });
  return jsonData;
};

// Función para procesar los datos de Excel y formatearlos
const processExcelData = (data) => {
  const jsonData = excelToJson(data);
  const formattedData = jsonData.reduce((acc, dato) => {
    let formattedDato = {};
    Object.keys(dato).forEach((key) => {
      if (columnMapping[key]) {
        if (dato[key] !== columnMapping[key]) {
          if (columnMapping[key] === "FECHA NACIMIENTO") {
            formattedDato[columnMapping[key]] = new Date((dato[key] - (25567 + 2)) * 86400 * 1000).toLocaleDateString();
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

export const renderExcelJson = (req, res) => {
  res.render('excel-json', { title: 'Cargar y Procesar Excel a JSON', data: [] });
};

export const renderTableCenso = (req, res) => {
  res.render('table-censo', { title: 'Tabla de Censo', data: [] });
};

export const uploadAndProcessExcel = async (req, res) => {
  try {
    if (!req.files || !req.files.excelFile) {
      throw new Error('No file uploaded');
    }
    const file = req.files.excelFile; // Se asume que el archivo se envía con el campo 'excelFile'
    const data = await fs.readFile(file.tempFilePath);
    const formattedData = processExcelData(data);
    
    const { viewType } = req.body; // Obtener el tipo de vista seleccionado por el usuario

    if (viewType === '1') {
      res.render('excel-json', { title: 'Datos del Censo en JSON', data: formattedData });
    } else if (viewType === '2') {
      res.render('table-censo', { title: 'Tabla de Censo', data: formattedData });
    } else {
      res.status(400).send('Invalid view type selected');
    }
  } catch (error) {
    console.error('Error processing Excel file:', error);
    res.status(500).render('excel-json', { title: 'Cargar y Procesar Excel a JSON', error: 'Ocurrió un error al procesar el archivo Excel.', data: [] });
  }
};