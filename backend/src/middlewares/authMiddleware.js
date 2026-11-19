import jwt from "jsonwebtoken";
import Usuario from "../models/usuarioModel.js";

const verificarToken = async (req , res, next)=>{
    try {
        const authorizacion=req.headers.authorization;

        if(!authorizacion || !authorizacion.startsWith("Bearer ")){
            return res.status(401).json({
                mensaje: "token no proporcionado"
            })
        }
        const token = authorizacion.split(" ")[1]
        const decoded=jwt.verify(
            token, process.env.JWT_SECRET, 
            {algorithms: ["HS256"]}
        )
        const usuario= await Usuario.findById(decoded.sub)

        if(!usuario || !usuario.estado){
            return res.status(401).json({
                mensaje: "Usuario no autorizado"
            })
        }

        req.usuario=usuario
        next()
    } catch (error) {

        if(error.name==="JsonWebTokenError" || 
            error.name==="TokenExpiredError" ||
            error.name==="NotBeforeError" ||
            error.name==="CastError"
        ){
            return res.status(401).json({
                mensaje: "Token no válido"
            })
        }
    }
}
export default verificarToken
