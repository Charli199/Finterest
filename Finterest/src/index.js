const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const uuid = require('uuid/v4');
const { format } = require('timeago.js');
const path = require('path');

// Inicializaciones
const app = express();
require('./database');

//Configuraciones
app.set('views', path.join(__dirname, 'views')); // Ubicación de la carpeta views
app.set('view engine', 'ejs'); // Montor de plantillas 
app.set('port', process.env.PORT || 4000);

// Intercambio de información
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/uploads'),
    filename: (req, file, cb, filename) => { 
        console.log(file);
        cb(null, uuid() + path.extname(file.originalname));
    }
}) 
app.use(multer({storage}).single('image')); // Poder subir la imagénes

// Variables globales
app.use((req, res, next) => {
    app.locals.format = format;
    next();
});

// Rutas
app.use(require('./routes/index'));

// Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar servidor
app.listen(4000, () => {
    console.log(`Server on port ${app.get('port')}`);
});
