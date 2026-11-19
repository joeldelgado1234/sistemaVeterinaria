import api from "./api";

export const registrarUsuario=async(datos)=>{
    const respuesta = await api.post("/auth/register", datos);

    return respuesta.data
}

export const iniciarSesion=async(credenciales)=>{
    const respuesta=await api.post("/auth/login", credenciales);

    return respuesta.data;
}

export const obtenerPerfil=async(token)=>{
    const respuesta=await api.get("/auth/pefil",{
        Headers:{
            Authorization:`Bearer ${token}`
        }
    });

    return respuesta.data;
}