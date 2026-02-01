const express = require("express");
const cors = require("cors");
const { syncDb } = require("./src/models");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importar routers
const restauranteRoutes = require('./src/routes/restauranteRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const platoRoutes = require('./src/routes/platoRoutes');
const pedidoRoutes = require('./src/routes/pedidoRoutes');
const reseniaRoutes = require('./src/routes/reseniaRoutes');
const cantonRoutes = require('./src/routes/cantonRoutes');
const alergiaRoutes = require('./src/routes/alergiaRoutes');
const deliveryRoutes = require('./src/routes/deliveryRoutes');

const solicitudRoutes = require('./src/routes/solicitudRoutes');

// Endpoint principal
app.get("/", (req, res) => {
  res.send("API de LojitaFood funcionando correctamente");
});

// Rutas API
app.use('/api/restaurantes', restauranteRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/platos', platoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/resenias', reseniaRoutes);
app.use('/api/cantones', cantonRoutes);
app.use('/api/alergias', alergiaRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/solicitudes', solicitudRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await syncDb(); // Sincroniza la base de datos usando la función del modelo
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
};

startServer();
