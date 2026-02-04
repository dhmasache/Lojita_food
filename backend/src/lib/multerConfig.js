const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Asegúrate de que este path sea accesible y tenga permisos de escritura
        cb(null, path.join(__dirname, '../../uploads')); // Guarda en la carpeta 'uploads' en la raíz del proyecto
    },
    filename: (req, file, cb) => {
        // Generar un nombre de archivo único
        const uniqueSuffix = crypto.randomBytes(16).toString('hex');
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
});

// Filtro de archivos para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no soportado. Solo se permiten imágenes.'), false);
    }
};

// Configuración de Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB de límite
    }
});

module.exports = upload;
