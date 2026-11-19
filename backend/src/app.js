// Framework utilizado para crear el servidor y manejar rutas HTTP.
import express from "express";

// Permite habilitar solicitudes desde otros orígenes, como el frontend.
import cors from "cors";
import authRouter from "./routes/authRouter.js"
import errorMiddleware from "./middlewares/errorMiddleware.js"



// Se crea la aplicación de Express.
const app = express();

// Configura CORS para permitir solicitudes únicamente desde el frontend
// que se ejecuta en el puerto 5173.
app.use(cors({
    origin: "http://localhost:5173"
}));

// Permite recibir y procesar datos enviados al servidor en formato JSON.
app.use(express.json());

// Define una ruta GET para la URL principal del servidor.
app.get("/", (req, res) => {
    // Envía una respuesta JSON al cliente.
    res.json({
        mensaje: "Api veterinaria funcionando correctamente"
    });
});

app.use("/api/auth", authRouter)
app.use((req, res)=>{
    res.status(404).json({
        mensaje: "Ruta no encontrada"
    })
})
//el middleware de error se coloca al final de todas las rutas y middlewares porque se ejecuta cuando ocurre un error en cualquier parte de la aplicación.
// Exporta la aplicación para usarla desde otro archivo, como server.js.
export default app;