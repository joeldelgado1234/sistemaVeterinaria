import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import app from "./src/app.js";
import conectarDB from "./src/config/database.js";

dotenv.config({
    path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env")
});

const PORT = process.env.PORT || 300;

const iniciarServidor=async()=>{
    try {
        await conectarDB()

        app.listen(PORT, ()=>{
            console.log(`servidor ejecutandose en http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error("Error al iniciar el servidor: ", error.message);
        process.exit(1)
        
    }
}

iniciarServidor()