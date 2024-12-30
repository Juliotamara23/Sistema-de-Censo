import { Router } from 'express'
import { renderExcelJson, renderTableCenso, uploadAndProcessExcel } from '../controllers/censoController.js'
import { renderExcelJsonRenta, renderTableRenta, uploadAndProcessExcelRenta, getRentaData } from '../controllers/rentaController.js'

const router = Router()

router.get('/', (req, res) => {
  res.render('index', { title: 'Procesador de archivos', error: null })
})

router.get('/process_censo', (req, res) => {
  res.render('process_censo', { title: 'Sistema de Censo', error: null })
})

router.get('/process_renta', (req, res) => {
  res.render('process_renta', { title: 'Sistema de Renta', error: null })
})

router.get('/excel-json', renderExcelJson);
router.get('/table-censo', renderTableCenso);
router.post('/upload-censo', uploadAndProcessExcel);
// Reporte para depuracion de Altas
router.get('/excel-json-altas', renderExcelJsonRenta);
router.get('/table-renta', renderTableRenta);
router.post('/upload-renta', uploadAndProcessExcelRenta);

// Api endpoint del datatable
router.post('/api/renta-data', getRentaData);

export default router