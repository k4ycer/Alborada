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