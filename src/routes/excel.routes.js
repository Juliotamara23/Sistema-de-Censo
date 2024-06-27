import { Router } from 'express'
import { renderExcelJson, renderTableCenso, uploadAndProcessExcel } from '../controllers/excelController.js'

const router = Router()

router.get('/', (req, res) => {
  res.render('index', { title: 'Sistema de Censo', error: null })
})

router.get('/excel-json', renderExcelJson);
router.get('/table-censo', renderTableCenso);
router.post('/upload', uploadAndProcessExcel);

export default router