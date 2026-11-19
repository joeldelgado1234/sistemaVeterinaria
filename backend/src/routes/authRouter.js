import express from "express"

import {
    registrarUsuario, 
    iniciarSesion,
    obtenerPerfil
}from "../controllers/authController.js"
import verificarToken from "../middlewares/authMiddleware.js"
import autorizarRoles from "../middlewares/roleMiddleware.js"

const router = express.Router();

router.post("/register", registrarUsuario);

router.post("/login", iniciarSesion)

router.get("/perfil", verificarToken, obtenerPerfil);

router.get(
    "/admin", 
    verificarToken,
    autorizarRoles("administrador"), 
    (req, res)=>{
        res.json({
            mensaje:"Acceso permitido al area de administracion"
        })
    }
)

export default router;