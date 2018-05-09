import Respuesta from "../models/Respuesta";
import Usuario from "../models/Usuario";

declare var swal: any;

export class UserProvider{
    constructor(){}

    getUsuarios(): Promise<Usuario[]>{
        let usuarios: Usuario[];

        return new Promise((resolve, reject) => {
            $.ajax({
                url: "../php/getUsers.php",
                method: "POST",
                success: response => {
                    usuarios = JSON.parse(response).map((usuario: any) => Usuario.EntityToClass(usuario));                    
                    resolve(usuarios);
                },
                error: e => {
                    reject(new Respuesta(false, "Lo sentimos, algo salio mal"));
                }
            });
        });
    }


    insertUsuario(usuario: Usuario): Promise<Respuesta>{
        let formData: FormData;

        formData = new FormData();
        formData.append("correo", usuario.correo);
        formData.append("contrasena", usuario.contrasena);
        formData.append("nombre", usuario.nombre);
        formData.append("privilegio", usuario.privilegio.toString());

        return new Promise((resolve, reject) => {
            $.ajax({
                url: "../php/insertUser.php",
                method: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: response => resolve(new Respuesta(true, "Datos insertados correctamente")),
                error: response => reject(new Respuesta(false, "Lo sentimos, algo salió mal"))
            });
        });
    }
}