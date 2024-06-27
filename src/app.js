import express from 'express'
import path from 'path'
import fileUpload from 'express-fileupload';
import { fileURLToPath } from 'url'
import { config } from './config/index.js'
import router from './routes/excel.routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Configuración del puerto
const PORT = config.port || 3000

// Configuración de EJS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Configurar express-fileupload
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// Middlewares
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Rutas
app.use('/', router)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});
