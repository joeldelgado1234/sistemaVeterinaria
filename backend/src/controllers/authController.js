import Usuario from "../models/usuarioModel.js"
import generarToken from "../util/generarToken.js"

const registrarUsuario=async(req, res)=>{
    try{
        const {nombre, correo, password}=req.body;

        if(!nombre || !correo || !password){
            return res.status(400).json({error:"Todos los campos son obligatorios"})
        }
        const existeUsuario=await Usuario.findOne({
            correo:correo.trim().toLowerCase()
        })

        if(existeUsuario){
            return res.status(400).json({error:"El usuario ya existe"})
        }

        const usuario=await Usuario.create({
            nombre, 
            correo:correo.trim().toLowerCase(),
            password,
            rol: "veterinario"
        })

        return res.status(201).json({
            mensaje:"Usuario registrado correctamente",
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol
            }
        })

    }catch(error){
        if (error.code === 11000) {
            return res.status(400).json({ error: "El correo ya está registrado" });
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: "Error al registrar el usuario" });
    }
}

const iniciarSesion=async(req, res)=>{
    try {
        const {correo, password}=req.body;
        if(
            typeof correo !== "string" ||
            typeof password !== "string" ||
            !correo.trim() 
        ){
            return res.status(400).json({
                mensaje: "correo y contraseña son obligatorios"
            })
        }

        const usuario=await Usuario.findOne({
            correo: correo.trim().toLowerCase()
        }).select("+password")

        if(!usuario){
            return res.status(401).json({
                mensaje:"Credenciales incorrectas"
            })
        }

        const passwordCorrecto= await usuario.compararPassword(password)

        if(!passwordCorrecto){
            return res.status(401).json({
                mensaje:"Credenciales incorrectas"
            })
        }

        if(!usuario.estado){
            return res.status(403).json({
                mensaje:"Usuario incativo"
            })
        }

        const token = generarToken(usuario);
        res.json({
            mensaje:"Inicio de sesion correcto", 
            token, 
            usuario:{
                id: usuario._id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol
            }
        })


    } catch (error) {
        console.error("Error al iniciar sesión:", error)
        return res.status(500).json({
            mensaje:"Error al iniciar sesion"
        })
    }
}

const obtenerPerfil=async(req, res)=>{
    res.json({
        usuario:{
            id: req.usuario._id,
            nombre: req.usuario.nombre,
            correo: req.usuario.correo,
            rol: req.usuario.rol,
            estado: req.usuario.estado
        }
    })
}

export {
    registrarUsuario,
    iniciarSesion,
    obtenerPerfil
}

