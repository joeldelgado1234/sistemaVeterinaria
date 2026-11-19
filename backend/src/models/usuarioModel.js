import mongoose from "mongoose"
import bcrypt from "bcrypt"

const usuarioSchema=new mongoose.Schema(
    {
        nombre:{
            type:String, 
            required:true, 
            trim:true, 
            minlength:3
        },
        correo: {
            type:String, 
            required: true, 
            unique: true, 
            lowercase: true, 
            trim: true, 
            match:/^[^\s@]+@[^\s@]+\.[^\s@]+$/
        }, 
        password: {
            type:String, 
            required: true, 
            minlength:8, 
            select: false
        }, 
        rol:{
            type:String,
            enum:["admin", "veterinario"],
            default:"veterinario"

        },
        estado:{
            type:Boolean,
            default:true
        }
    
    },
    {
        timestamps:true
        //sirve para que mongoose cree automaticamente los campos createdAt y updatedAt en el documento, lo cual es útil para llevar un registro de cuando se creo o actualizo un documento en la base de datos.
    }

)

//cifrar las contraseñas antes de guardar a la base 
usuarioSchema.pre("save", async function () {
    if(!this.isModified("password")){
        return 
    }
    this.password=await bcrypt.hash(this.password, 12)
    
})

usuarioSchema.methods.compararPassword=async function (password) {
    return await bcrypt.compare(password, this.password)
    
}

const Usuario = mongoose.model("Usuario", usuarioSchema)

export default Usuario;