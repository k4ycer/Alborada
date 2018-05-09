import Respuesta from "../models/Respuesta";
import Usuario from "../models/Usuario";

declare var swal: any;

export class UserProvider{
    constructor(){}


    ////////////////////////////////////////
    //
    // getCurrentUserId
    //
    /////////////////////////////////////////
    getCurrentUserId(): Promise<number>{
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "../php/getCurrentUser.php",
                type: 'GET',
                success: res => {
                    res = JSON.parse(res);

                    if(res.status == 1)
                        resolve(res.userId);
                    else
                        reject(res.reason);
                },
                error: err => {
                    reject(err);
                }
            });
        }); 
    }

    
    ////////////////////////////////////////
    //
    // getUsuarios
    //
    /////////////////////////////////////////
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

    /////////////////////////////////////////
    //
    // updateUsuariosExcel
    //
    /////////////////////////////////////////
    updateUsuariosExcel(file: any): Promise<Respuesta> {
        var form_data = new FormData();
        form_data.append("archivo", file)
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: '../php/UpdateUsuarioData.php',
                dataType: 'text',
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,
                success: function (data) {
                    if (data == "Exito") {
                        resolve(new Respuesta(true, ""));
                    } else {
                        reject(new Respuesta(false, "Error actualizando"))
                    }
                    console.log(data);
                },
                error: function (e) {
                    // Error in upload
                    reject(new Respuesta(false, "Error actualizando"))
                }
            });
        });
    }


    ////////////////////////////////////////
    //
    // insertUsuario
    //
    /////////////////////////////////////////
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