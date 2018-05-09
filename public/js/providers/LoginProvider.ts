import Respuesta from "../models/Respuesta";

declare var swal: any;

export class LoginProvider{
    constructor(){}


    /////////////////////////////////////////
    //
    // cerrarSesion
    //
    /////////////////////////////////////////
    cerrarSesion(){
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "../php/logout.php",
                method: "POST",
                success: async response => {                
                    window.location.replace("login.html");                    
                    resolve();
                },
                error: async error => {
                    // Error sesion
                    await swal({
                        title: "Error en cerrar sesión",
                        text: "Hubo un error al cerrar la sesión",
                        buttons: {
                            confirm: true,
                        },
                        icon:"error"
                    });                    
                    reject();
                }
            });
        });
    }


    /////////////////////////////////////////
    //
    // iniciarSesion
    //
    /////////////////////////////////////////
    iniciarSesion(usuario: string, contrasena: string): Promise<Respuesta>{
        console.log("iniciando sesion 2");
        let formData: FormData;

        formData = new FormData();
        formData.append("user", usuario);
        formData.append("password", contrasena);

        return new Promise((resolve, reject) => {
            $.ajax({
                url: "../php/login.php",
                method: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: async response => {          
                    console.log(response);
                    if(response == "correcto"){
                        resolve(new Respuesta(true, ""));
                    }else{
                        reject(new Respuesta(false, "Usuario o contraseña invalidos"));
                    }
                },
                error: async error => {
                    reject(new Respuesta(false, "Hubo un error al iniciar la sesión"));                                
                }
            });           
        });
    }


    /////////////////////////////////////////
    //
    // validaSesion
    //
    /////////////////////////////////////////
    validaSesion(): Promise<any>{
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "../php/inicio.php",
                method: "POST",
                success: async response => {
                    if(response != "1"){
						// Error sesion
						await swal({
		            		title: "Error en sesión",
		            		text: "Inicia sesion para continuar",
		            		buttons: {
		            		    confirm: true,
		            	  	},
		            	  	icon:"error"
                        });
                        
                        window.location.replace("login.html");
                    }
                    
                    resolve();
                },
                error: async error => {
                    // Error sesion
                    await swal({
                        title: "Error en sesión",
                        text: "Inicia sesion para continuar",
                        buttons: {
                            confirm: true,
                        },
                        icon:"error"
                    });
                    
                    window.location.replace("login.html");

                    reject();
                }
            });
        });				
	}
}